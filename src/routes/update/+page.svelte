<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import { open } from '@tauri-apps/plugin-dialog';
	import { readTextFile } from '@tauri-apps/plugin-fs';
	import { success, error, info } from '$lib/toasts';
	import { config } from '$stores/session';
	import Modal from '$components/Modal.svelte';
	import { fileArchiveO } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
	import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
	import ProgressBar from '@okrad/svelte-progressbar';
	import { newConnection } from '$lib/api';

	interface ProgressPayload {
		percentage: number;
	}

	const appWindow = WebviewWindow.getCurrent();
	export let series = [0];

	async function setUpProgressListener() {
		await appWindow.listen('PROGRESS', ({ payload }) => {
			series = [(payload as ProgressPayload).percentage];
			flashing = true;
		});
	}
	setUpProgressListener();

	let changelog = '';
	let hex = '';
	let version = '';
	let showModal = false;
	let flashing = false;

	async function writeFirmware() {
		if (hex == '') {
			error('No firmware HEX content found, not doing anything');
			return;
		}

		let res = await invoke('dtr', { level: true }).catch((err: { message: string }) => {
			error('Failed to write DTR signal to true: ' + err.message);
		});
		// Wait for the ShiftLight to reboot
		await new Promise((r) => setTimeout(r, 200));

		res = await invoke('dtr', { level: false }).catch((err: { message: string }) => {
			error('Failed to write DTR signal to false: ' + err.message);
		});

		// Waiting some more
		await new Promise((r) => setTimeout(r, 200));

		let helloResponse: string = await invoke('write', { content: 'hi\n' })
			.then((res: any) => {
				return res.replace('hi;', '');
			})
			.catch((err: { message: string }) => {
				error('Failed to write hi: ' + err);
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
			});
		series = [0];
		flashing = false;

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

			hex = await readTextFile(file.path.path).catch((err: { message: string }) => {
				error('Failed to read file: ' + err.message);
				return '';
			});
			changelog = 'Custom firmware';
			showModal = true;
		});
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex flex-col mx-auto text-black bg-white dark:bg-gray-400 shadow-md rounded px-8 pt-6 pb-8 mb-4"
>
	<div class="text-center text-xl inline-grid grid-cols-2 gap-4">
		<div class="text-left">Current version:</div>
		<div>#{$config.VER}</div>

		<label for="newReleaseIcon">Select custom firmware hex file:</label>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="cursor-pointer" on:click={getFile} on:keydown={getFile}>
			<Icon data={fileArchiveO} scale={2} />
		</div>
	</div>
</div>

<Modal
	title="Flash Firmware From File: #{file?.path?.path}"
	open={showModal}
	on:close={() => handleToggleModal()}
>
	<svelte:fragment slot="body">
		<div class="flex items-center justify-center">
			{#if series[0] !== 0}
				{series[0]}% <ProgressBar {series} />
			{/if}
		</div>

		<button class="input ke-button" on:click={writeFirmware}>Write</button>
	</svelte:fragment>
</Modal>
