<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import { success, error } from '$lib/Toasts';
	import { session } from '$lib/Store';

	let changelog = '';
	let hex = '';
	let version = '#';

	async function checkForNewVersion() {
		$session.loading = true;
		await invoke('get_latest_firmware')
			.then((res) => {
				changelog = res.changelog;
				hex = res.hex;
				version = res.version;
			})
			.catch((e) => error(e))
			.finally(() => ($session.loading = false));
	}

	async function write_firmware() {
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
</script>

<div class="m-4">
	<div class="row m-2">Firmware version: {version}</div>
	<div class="row m-2">
		<h2>Change log:</h2>
		<article class="dark:text-white prose lg:prose-xl">{changelog}</article>
	</div>

	<button type="button" class="ke-button input" on:click={checkForNewVersion}>
		Check for new version
	</button>

	<button
		type="button"
		class="ke-button input disabled:opacity-50"
		on:click={write_firmware}
		disabled={!hex}
	>
		Update firmware
	</button>
</div>
