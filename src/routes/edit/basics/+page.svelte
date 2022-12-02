<script lang="ts">
	import { submitConfig } from '$lib/API';
	import { session, config } from '$lib/Store';
	import { success, error } from '$lib/Toasts';
	import { ShiftLightConfigs } from '$lib/Config';
	import { validate_config } from '$lib/Validator';
	import EditParameters from '../../../components/EditParameters.svelte';
	import { page } from '$app/stores';

	async function update(): Promise<void> {
		let res = validate_config(configCopy);
		if (!res.is_valid) {
			error(res.error);
			return;
		}

		$session.loading = true;

		submitConfig(configCopy, $session.port.port_name)
			.then((results) => {
				if (results.error.length > 0) {
					error(JSON.stringify('An error occurred while setting some values'));
				} else {
					success('Config updated');
				}
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => {
				$session.loading = false;
			});
	}
	let configCopy = $config;

	$: dark = $session.darkTheme;
</script>

<div class="m-2">
	<label for="CONFIG">
		<span class="dark:text-white">Config Type:</span>
	</label>

	<select class="input select select-sm" id="configType" bind:value={configCopy.CONFIG} required>
		{#each Object.keys(ShiftLightConfigs) as type}
			{#if type != 'All'}
				<option>{type}</option>
			{/if}
		{/each}
	</select>
</div>

<hr class="mb-2" />

<!-- Only show port selection until a port is chosen -->
<!-- Our form for out version the shiftlight is configured for -->
<form on:submit|preventDefault={update} class="grid grid-cols-3 gap-4 max-w-xl m-auto">
	{#if configCopy.CONFIG}
		<EditParameters
			inputOptions={{ ...ShiftLightConfigs['All'], ...ShiftLightConfigs[configCopy.CONFIG] }}
			fieldType="basics"
			{dark}
		/>

		<div class="col-span-full flex place-content-end">
			<button class="ke-button input">Update</button>
		</div>
	{/if}
</form>
<!-- {:else}
	<div class="flex justify-center">Nothing here yet, is the serial port connected?</div>
{/if} -->
