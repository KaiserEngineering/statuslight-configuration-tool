<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { success, error } from '$lib/Toasts';
	import { session } from '$lib/Store';

	let changelog = '';
	let hex = '';

	async function checkForNewVersion() {
		$session.loading = true;
		invoke('get_latest_firmware')
			.then((res) => {
				changelog = res.changelog;
				hex = res.hex;
			})
			.catch((e) => error(e))
			.finally(() => ($session.loading = false));
	}

	async function write_firmware() {
		$session.loading = true;
		if (hex == '') {
			error('No firmware HEX content found, not doing anything');
			return;
		}
		await invoke('write', { content: hex })
			.then((res) => {
				success(res);
			})
			.catch((err) => {
				// Backend sends back SerialError object
				error(err.message);
			})
			.finally(() => ($session.loading = false));
	}
</script>

<div class="m-4">
	<div class="row m-2">Firmware version: 1.x.x</div>
	<div class="row m-2">Change log: {changelog}</div>

	<button
		type="button"
		class="dark:bg-slate-400 bg-gray-300 p-2 rounded m-2"
		on:click={checkForNewVersion}
	>
		Check for new version
	</button>

	<button
		type="button"
		class="dark:bg-slate-400 bg-gray-300 p-2 rounded m-2"
		on:click={write_firmware}
	>
		Update firmware
	</button>
</div>
