<script lang="ts">
	import { submitConfig } from '$lib/API';
	import { session, config, port, newConnection } from '$lib/Store';
	import { success, error } from '$lib/Toasts';
	import { ShiftLightConfigs } from '$lib/Config';
	import { validate_config } from '$lib/Validator';
	import EditParameters from './EditParameters.svelte';

	let configCopy = Object.assign({}, $config);
	export let fieldType: string;
	let groupings: { [key: string]: any } = {};

	// Get each type of config RPM, Boost, etc
	Object.keys(ShiftLightConfigs).forEach((configType: string) => {
		if (configType === 'All') {
			return;
		}
		groupings[configType] = {};

		let inputOptions = {
			...ShiftLightConfigs['All'],
			...ShiftLightConfigs[configType]
		};

		// Then build the groupings for the page we are rendering
		Object.keys(inputOptions).forEach((input: string) => {
			let inputOption = inputOptions[input];

			inputOption.value = input;

			if (
				(fieldType != 'basics' && inputOption.fieldType.toLowerCase() != 'basics') ||
				inputOption.fieldType.toLowerCase() === fieldType
			) {
				if (groupings[configType][inputOption.fieldType]) {
					groupings[configType][inputOption.fieldType].push(inputOption);
				} else {
					groupings[configType][inputOption.fieldType] = [inputOption];
				}
			}
		});
	});

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

		if ($port !== null) {
			submitConfig(updatedFields, $port.port_name)
				.then((results) => {
					if (results.error.length > 0) {
						error(JSON.stringify('An error occurred while setting some values'));
					} else {
						$config = Object.assign({}, $config);
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

	$: {
		if ($newConnection) {
			// Acknowledge
			$newConnection = false;
			configCopy = Object.assign({}, $config);
		}
	}

	$: dark = $session.darkTheme;

	// Delete All from our list of config modes
	const ShiftLightConfigsModes = Object.assign({}, ShiftLightConfigs);
	delete ShiftLightConfigsModes.All;
</script>

<div class="m-2">
	<label for="CONFIG">
		<span class="dark:text-white">Config Type:</span>
	</label>

	<select class="input select select-sm" id="configType" bind:value={configCopy.CONFIG} required>
		{#each Object.keys(ShiftLightConfigsModes) as type}
			<option>{type}</option>
		{/each}
	</select>
</div>

<hr class="mb-2" />

<!-- Only show port selection until a port is chosen -->
<!-- Our form for out version the shiftlight is configured for -->
{#if $port}
	<form on:submit|preventDefault={update} class="w-3/4">
		<EditParameters config={configCopy} groupings={groupings[configCopy.CONFIG]} {dark} />

		<div class="col-span-full flex place-content-end">
			<button class="ke-button input">Update</button>
		</div>
	</form>
{:else}
	No serial port connected
{/if}
