<script lang="ts">
	import { submitConfig } from '$lib/API';
	import { session, config } from '$lib/Store';
	import { success, error } from '$lib/Toasts';
	import { ShiftLightConfigs } from '$lib/Config';
	import { validate_config } from '$lib/Validator';

	import Fa from 'sveltejs-fontawesome';
	import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

	async function update(): Promise<void> {
		let res = validate_config(configCopy);
		if (!res.is_valid) {
			error(res.error);
			return;
		}

		$session.loading = true;

		submitConfig($config, $session.port.port_name)
			.then((results) => {
				if (results.error.length > 0) {
					error(JSON.stringify('An error occurred while setting some values'));
				} else {
					$config = results;
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
	let inputOptions = ShiftLightConfigs[configCopy.CONFIG] || {};

	$: dark = $session.darkTheme;
</script>

<div class="m-2">
	<label for="CONFIG">
		<span class="dark:text-white">Config Type:</span>
	</label>

	<select class="input select select-sm" id="configType" value={$config.CONFIG} required>
		{#each Object.keys(ShiftLightConfigs) as type}
			<option>{type}</option>
		{/each}
	</select>
</div>

<hr class="mb-2" />

<!-- Only show port selection until a port is chosen -->
{#if inputOptions}
	<!-- Our form for out version the shiftlight is configured for -->
	<form on:submit|preventDefault={update} class="grid grid-cols-3 gap-4 max-w-xl m-auto">
		{#each Object.keys(inputOptions) as input}
			<div class="col-span-1 flex items-center justify-start">
				<label for={input}>
					<span class="dark:text-white">{input}:</span>
				</label>
				<!-- svelte-ignore a11y-missing-attribute -->
				{#if inputOptions[input]['info']}
					<span
						data-bs-toggle="tooltip"
						data-bs-placement="top"
						title={inputOptions[input]['info']}
						class="m-1 cursor-pointer"
					>
						<Fa icon={faCircleInfo} size="12" color={dark ? 'white' : 'black'} />
					</span>
				{/if}
			</div>

			<div class="col-span-2">
				{#if typeof inputOptions[input]['type'] == 'string'}
					<input
						max={inputOptions[input]['max']}
						min={inputOptions[input]['min']}
						type="number"
						value={configCopy[inputOptions[input]['code']]}
						class="input w-1/2 p-2"
						id={inputOptions[input]['code']}
						required
					/>
				{:else}
					<select
						class="input w-1/2"
						id={inputOptions[input]['code']}
						value={configCopy[inputOptions[input]['code']]}
						required
					>
						{#each inputOptions[input]['type'] as option}
							<option value={option['value']}>{option['label']}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}

		<div class="col-span-full flex place-content-end">
			<button class="ke-button input">Update</button>
		</div>
	</form>
{:else}
	<div class="flex justify-center">Nothing here yet, is the serial port connected?</div>
{/if}
