<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { open } from '@tauri-apps/api/dialog';
	import { readTextFile } from '@tauri-apps/api/fs';
	import { success, error } from '$lib/Toasts';
	import { session } from '$lib/Store';
	import Modal from '../../components/Modal.svelte';
	import { faKiwiBird } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'sveltejs-fontawesome';

	let changelog = '';
	let hex = '';
	let version = '#';
	let showModal = false;

	async function checkForNewVersion() {
		$session.loading = true;
		await invoke('get_latest_firmware')
			.then((res) => {
				changelog = res.changelog;
				hex = res.hex;
				version = res.version;

				showModal = true;
			})
			.catch((e) => error(e))
			.finally(() => ($session.loading = false));
	}

	async function writeFirmware() {
		$session.loading = true;
		if (hex == '') {
			error('No firmware HEX content found, not doing anything');
			$session.loading = false;
			return;
		}
		invoke('write_firmware', { hex: hex })
			.then(() => {
				success('Firmware written');
			})
			.catch((err) => {
				// Backend sends back SerialError object
				error(err.message);
			})
			.finally(() => ($session.loading = false));
	}

	const handleToggleModal = () => {
		showModal = !showModal;
	};

	let file = {
		path: undefined
	};

	async function getFile() {
		await open({
			multiple: false,
			filters: [
				{
					name: 'Hex File',
					extensions: ['hex']
				}
			]
		}).then(async (fileObj) => {
			file.path = fileObj;

			hex = await readTextFile(file.path);
			changelog = 'Custom firmware';
			version = 'custom';
			showModal = true;
		});
	}

	$: dark = $session.darkTheme;
</script>

<div class="sidebar-icon group" on:click={checkForNewVersion} on:keydown={checkForNewVersion}>
	<Fa icon={faKiwiBird} color={dark ? 'white' : 'black'} />

	<span class="sidebar-tooltip group-hover:scale-100">Check for new version</span>
</div>

<div>
	<button class="ke-button input" on:click={getFile}>Select custom firmware hex file</button>
</div>

<Modal title="New Version Found: #{version}" open={showModal} on:close={() => handleToggleModal()}>
	<svelte:fragment slot="body">
		<div class="row m-2">
			<h2>Change log:</h2>
			<article class="dark:text-black prose lg:prose-xl">{changelog}</article>
		</div>

		<button class="input ke-button" on:click={writeFirmware}>Write</button>
	</svelte:fragment>
</Modal>
