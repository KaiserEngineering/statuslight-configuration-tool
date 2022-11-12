<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { open } from '@tauri-apps/api/dialog';
	import { readTextFile } from '@tauri-apps/api/fs';
	import { success, error } from '$lib/Toasts';
	import { session, config } from '$lib/Store';
	import Modal from '../../components/Modal.svelte';
	import { faArrowCircleUp, faFileArchive } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'sveltejs-fontawesome';

	let changelog = '';
	let hex = '';
	let showModal = false;

	async function checkForNewVersion() {
		$session.loading = true;
		await invoke('get_latest_firmware')
			.then((res) => {
				changelog = res.changelog;
				hex = res.hex;

				showModal = true;
			})
			.catch((e) => error(e))
			.finally(() => ($session.loading = false));
	}

	let progress = 0;

	async function writeFirmware() {
		$session.loading = true;
		if (hex == '') {
			error('No firmware HEX content found, not doing anything');
			$session.loading = false;
			return;
		}
		const lines = hex.split(/\r?\n|\r|\n/g);

		progress = 0;

		for (let line of lines) {
			try {
				await invoke('write', { content: line });
				progress = progress + 1;
			} catch (err) {
				error(err.message);
				$session.loading = false;
				showModal = false;
				break;
			}
		}
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
			if (fileObj == undefined) {
				return;
			}
			file.path = fileObj;

			hex = await readTextFile(file.path);
			changelog = 'Custom firmware';
			showModal = true;
		});
	}

	$: dark = $session.darkTheme;
</script>

Current version: #{$config.VER}

<div
	class="m-2 cursor-pointer flex items-center"
	on:click={checkForNewVersion}
	on:keydown={checkForNewVersion}
>
	<span class="mr-2 content-center" for="newReleaseIcon">Check for new release</span>
	<Fa icon={faArrowCircleUp} size="28" color={dark ? 'white' : 'black'} />
</div>

<div class="m-2 cursor-pointer flex items-center" on:click={getFile} on:keydown={getFile}>
	<label class="mr-2 content-center" for="newReleaseIcon">Select custom firmware hex file</label>
	<Fa icon={faFileArchive} size="28" color={dark ? 'white' : 'black'} />
</div>

<Modal
	title="New Version Found: #{$config.VER}"
	open={showModal}
	on:close={() => handleToggleModal()}
>
	<svelte:fragment slot="body">
		<div class="row m-2">
			<h2>Change log:</h2>
			<article class="dark:text-black prose lg:prose-xl">{changelog}</article>
		</div>

		{progress}

		<button class="input ke-button" on:click={writeFirmware}>Write</button>
	</svelte:fragment>
</Modal>
