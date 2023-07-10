<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { open } from '@tauri-apps/api/dialog';
	import { readTextFile } from '@tauri-apps/api/fs';
	import { success, error, info } from '$lib/toasts';
	import { session, config } from '$lib/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { cog, fileArchiveO } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
	import { appWindow } from "@tauri-apps/plugin-window";
	import ProgressBar from '@okrad/svelte-progressbar';
	import semver from 'semver';
	import { newConnection } from '$lib/api';

	export let series = [0];

	async function setUpProgressListener() {
		const unlistenProgress = await appWindow.listen('PROGRESS', ({ payload }) => {
			series = [payload.percentage];
			flashing = true;
		});
	}
	setUpProgressListener();

	let changelog = '';
	let hex = '';
	let version = '';
	let showModal = false;
	let flashing = false;

	async function checkForNewVersion() {
		$session.loading = true;
		await invoke('get_latest_firmware')
			.then((res: any) => {
				if (semver.cmp(res.version, '>', $config.VER)) {
					changelog = res.changelog;
					hex = res.hex;
					version = res.version;

					showModal = true;
				} else {
					info(
						'Current version ' + $config.VER + ' is newer than ' + res.version + ", you're all set!"
					);
				}
			})
			.catch((e: { toString: () => string }) => {
				error(e.toString());
				$session.loading = false;
			})
			.finally(() => ($session.loading = false));
	}

	async function writeFirmware() {
		if (hex == '') {
			error('No firmware HEX content found, not doing anything');
			return;
		}

		let res = await invoke('plugin:serial|dtr', { level: true }).catch(
			(err: { message: string }) => {
				error('Failed to write DTR signal to true: ' + err.message);
			}
		);
		// Wait for the ShiftLight to reboot
		await new Promise((r) => setTimeout(r, 200));

		res = await invoke('plugin:serial|dtr', { level: false }).catch((err: { message: string }) => {
			error('Failed to write DTR signal to false: ' + err.message);
		});

		// Waiting some more
		await new Promise((r) => setTimeout(r, 200));

		let helloResponse: string = await invoke('plugin:serial|write', { content: 'hi\n' })
			.then((res: any) => {
				return res.replace('hi;', '');
			})
			.catch((err: { message: string }) => {
				error('Failed to write hi: ' + err.message);
			});

		if (helloResponse == undefined) {
			return;
		}

		flashing = true;
		await invoke('write_hex', { window: appWindow, hex: hex })
			.catch((err: { message: string }) => {
				error(err.message);
				flashing = false;
				return;
			})
			.then(async () => {
				await newConnection();
				flashing = false;
			});

		success('Firmware updated: ' + $config.VER);
	}

	const handleToggleModal = () => {
		if (flashing) {
			info('Flash in progress, hang around for a few minutes!');
			return;
		}
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
		}).then(async (fileObj: any) => {
			if (fileObj == undefined) {
				return;
			}
			file.path = fileObj;

			hex = await readTextFile(file.path);
			changelog = 'Custom firmware';
			showModal = true;
		});
	}
</script>

<div class="text-center text-xl inline-grid grid-cols-2 gap-4">
	<div class="text-left">Current version:</div>
	<div>#{$config.VER}</div>

	<span class="text-left">Check for Updates:</span>

	<div class="cursor-pointer" on:click={checkForNewVersion} on:keydown={checkForNewVersion}>
		<Icon data={cog} scale={2} />
	</div>

	<label for="newReleaseIcon">Select custom firmware hex file:</label>

	<div class="cursor-pointer" on:click={getFile} on:keydown={getFile}>
		<Icon data={fileArchiveO} scale={2} />
	</div>
</div>

<Modal title="Version: #{version}" open={showModal} on:close={() => handleToggleModal()}>
	<svelte:fragment slot="body">
		<div class="flex items-center justify-center">
			{semver.diff($config.VER, version)} change

			{#if series[0] !== 0}
				{series[0]}% <ProgressBar {series} />
			{/if}
		</div>

		<div class="row">
			<h2>Change log:</h2>
			<article class="ml-4 dark:text-black prose lg:prose-xl">{changelog}</article>
		</div>

		<button class="input ke-button" on:click={writeFirmware}>Write</button>
	</svelte:fragment>
</Modal>
