<script lang="ts">
	import { getCurrentConfig, submitConfig } from '$lib/api';
	import { session, config, port, connected } from '$lib/stores';
	import { success, error, info } from '$lib/toasts';
	import { ShiftLightConfigs } from '$lib/config';
	import { validate_config } from '$lib/validator';
	import EditParameters from './EditParameters.svelte';

	export let fieldType: string;
	let groupings: { [key: string]: any } = {};
	let configCopy = Object.assign({}, $config);
	$: $connected, $connected ? (configCopy = Object.assign({}, $config)) : '';

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
		if (!$connected) {
			error("You're not connected to your ShiftLight!");
			return;
		}

		let res = validate_config(configCopy);
		if (!res.is_valid) {
			error(res.error);
			return;
		}

		$session.loading = true;

		// Only grab the fields that were changed from the current value
		let updatedFields: { [key: string]: any } = {};
		Object.keys(configCopy).forEach((key) => {
			if ($config[key] !== configCopy[key]) {
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
			await getCurrentConfig()
				.then((res) => {
					$config = res;
				})
				.catch((err) => {
					error(err.message);
				});
		}
	}

	// Delete All from our list of config modes
	const ShiftLightConfigsModes = Object.assign({}, ShiftLightConfigs);
	delete ShiftLightConfigsModes.All;
</script>

<!-- Only show port selection until a port is chosen -->
<!-- Our form for out version the shiftlight is configured for -->
{#if configCopy && configCopy.ACT}
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
	<form on:submit|preventDefault={update} class="w-3/4">
		<EditParameters config={configCopy} groupings={groupings[configCopy.CONFIG]} />

		<div class="col-span-full flex place-content-end">
			<button class="ke-button ke-input input">Update</button>
		</div>
	</form>
{:else}
	<div class="flex grid h-full content-center">No configuration loaded from ShiftLight</div>
{/if}
