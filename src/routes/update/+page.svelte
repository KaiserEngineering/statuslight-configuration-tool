<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { open } from '@tauri-apps/api/dialog';
	import { readTextFile } from '@tauri-apps/api/fs';
	import { success, error } from '$lib/Toasts';
	import { session, config } from '$lib/Store';
	import Modal from '../../components/Modal.svelte';
	import { arrowCircleOUp, spinner, cog, fileArchiveO } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
	import { appWindow } from '@tauri-apps/api/window';
	import ProgressBar from "@okrad/svelte-progressbar";

	export let series = [0];

	async function setUpProgressListener() {
		const unlistenProgress = await appWindow.listen('PROGRESS', ({ event, payload }) => {
			series = series[payload.percentage];
		});
	}
	setUpProgressListener();
	$: {
		if (series[0] === 100 ) {
			console.log("Closing modal")
			showModal = false;
		} else if (series[0] !== 0) {
			console.log("Something is still going on")
		}
		
	}

	function progressSpoof() {
		series = [series[0] + 50]; 
	}
	

	let changelog = '';
	let hex = '';
	let version = '';
	let showModal = false;
	
	

	async function checkForNewVersion() {
		$session.loading = true;
		await invoke('get_latest_firmware')
			.then((res: any) => {
				changelog = res.changelog;
				hex = res.hex;
				version = res.version;

				showModal = true;
			})
			.catch((e) => error(e))
			.finally(() => ($session.loading = false));
	}

	async function writeFirmware() {
		if (hex == '') {
			error('No firmware HEX content found, not doing anything');
			return;
		}

		let res = await invoke('dtr', { level: true }).catch((err) => {
			error('Failed to write DTR signal to true: ' + err.message);
		});
		// Wait for the ShiftLight to reboot
		await new Promise((r) => setTimeout(r, 200));

		res = await invoke('dtr', { level: false }).catch((err) => {
			error('Failed to write DTR signal to false: ' + err.message);
		});

		// Waiting some more
		await new Promise((r) => setTimeout(r, 200));

		let helloResponse: string = await invoke('write', { content: 'hi\n' })
			.then((res: any) => {
				return res.replace('hi;', '');
			})
			.catch((err) => {
				error('Failed to write hi: ' + err.message);
			});

		if (helloResponse == undefined) {
			return;
		}

		await invoke('write_hex', { window: appWindow, hex: hex }).catch((err) => {
			error(err.message);
			return;
		});

		success('Firmware updated: ' + helloResponse);
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

Current version: #{$config.VER} 'X'

<div
	class="m-2 cursor-pointer flex items-center"
	on:click={checkForNewVersion}
	on:keydown={checkForNewVersion}
>
	<span class="mr-8 content-center" for="newReleaseIcon">Check for Updates</span>
	<Icon data={cog} scale={2} />
</div>

<div class="m-2 cursor-pointer flex items-center" on:click={getFile} on:keydown={getFile}>
	<label class="mr-2 content-center" for="newReleaseIcon">Select custom firmware hex file</label>
	<Icon data={fileArchiveO} scale={2} />
</div>


<Modal title="New Version Found: #{version}" open={showModal} on:close={() => handleToggleModal()}>
	<svelte:fragment slot="body">
		<div class="row m-8">
			<h2>Change log:</h2>
			<article class="dark:text-black prose lg:prose-xl">{changelog}</article>
			<Icon data={fileArchiveO} scale={2} />
		</div>	
		
			<div class="outerdog">
				<div class="innerdog"><ProgressBar {series} /></div>
			</div>

		<style>
			.innerdog, .outerdog {
				height: 20px;
				border-radius: 20px;
			}
			.outerdog {
				width: 20vw;
				margin: 50px auto;
				background-color: blue;
				border: transparent;
			}
		</style>
		
	

		<button class="input ke-button" on:click="{progressSpoof}">Spoof write</button>

		<button class="input ke-button" on:click={writeFirmware}>Write</button>
		

		
	</svelte:fragment>
</Modal>

