<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { success, error } from '$lib/Toasts';

	let changelog = '';
	let hex = '';

	async function checkForNewVersion() {
		console.log('Going to update firmware');
		invoke('get_latest_firmware')
			.then((res) => {
				changelog = res.changelog;
				hex = res.hex;
			})
			.catch((e) => error(e));
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
</div>
