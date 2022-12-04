<script lang="ts">
	import { submitConfig } from '$lib/API';
	import { session, config } from '$lib/Store';
	import { success, error } from '$lib/Toasts';
	import { ShiftLightConfigs } from '$lib/Config';
	import { validate_config } from '$lib/Validator';
	import EditParameters from './EditParameters.svelte';

	export let fieldType: string;

	async function update(): Promise<void> {
		let res = validate_config(configCopy);
		if (!res.is_valid) {
			error(res.error);
			return;
		}

		$session.loading = true;

		// Only grab the fields that were changed from the current value
		let updatedFields: { [key: string]: any } = {};
		Object.keys(configCopy).forEach((key) => {
			if (configCopy[key] !== $config[key]) {
				updatedFields[key] = configCopy[key];
			}
		});

		if ($config.CONFIG !== configCopy.CONFIG) {
			updatedFields.CONFIG = configCopy.CONFIG;
		}

		if ($session.port !== null) {
			submitConfig(updatedFields, $session.port.port_name)
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
	}
	let configCopy = Object.assign({}, $config);
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
{#if $session.port}
<form on:submit|preventDefault={update} class="w-3/4">
	{#if configCopy.CONFIG}
		<EditParameters configType={configCopy.CONFIG} {fieldType} {dark} />
	{/if}
	<div class="col-span-full flex place-content-end">
		<button class="ke-button input">Update</button>
	</div>
</form>
{:else}
No serial port connected
{/if}
