<script lang="ts">
	import { submitConfig } from '$lib/API';
	import { session, config, port } from '$lib/Store';
	import { success, error, info } from '$lib/Toasts';
	import { ShiftLightConfigs } from '$lib/Config';
	import { validate_config } from '$lib/Validator';
	import EditParameters from './EditParameters.svelte';
	import { listen } from '@tauri-apps/api/event';

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

		if (Object.keys(updatedFields).length == 0) {
			info('Nothing to update');
			$session.loading = false;
		} else if ($port !== null) {
			submitConfig(updatedFields, $port.port_name)
				.then((results) => {
					if (results.error.length > 0) {
						let error_message: string = '';
						results.error.forEach((error) => {
							error_message += `${error}\n`;
						});
						error(error_message);
					} else {
						$config = Object.assign({}, configCopy);
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

	async function setupNewConnectionListener() {
		const unlisten = await listen('new-connection', (event) => {
			// event.event is the event name (useful if you want to use a single callback fn for multiple event types)
			// event.payload is the payload object
			configCopy = Object.assign({}, $config);
		});
	}
	setupNewConnectionListener();

	$: dark = $session.darkTheme;

	// Delete All from our list of config modes
	const ShiftLightConfigsModes = Object.assign({}, ShiftLightConfigs);
	delete ShiftLightConfigsModes.All;
</script>

<div class="m-2">
	<label for="CONFIG">
		<span>Config Type:</span>
	</label>

	<select
		class="input ke-input select select-sm"
		id="configType"
		bind:value={configCopy.CONFIG}
		required
	>
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
			<button class="ke-button ke-input input">Update</button>
		</div>
	</form>
{:else}
	No serial port connected
{/if}
