<script lang="ts">
	import { submit_config } from '../lib/API';
	import { session, config } from '../lib/Store';
	import { success, error } from '../lib/Toasts';
	import { ShiftLightConfigs } from '../lib/Config';
	import { validate_config } from '$lib/Validator';

	import Fa from 'sveltejs-fontawesome';
	import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

	console.log($session.ui_data);

	async function update(): Promise<void> {
		let res = validate_config(configCopy);
		if (!res.is_valid) {
			error(res.error);
			return;
		}

		$session.loading = true;

		submit_config($config, $session.port.port_name)
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
	let configType = $session.configType || '';
	$: inputOptions = ShiftLightConfigs[configType] || {};

	$: dark = $session.darkTheme;
</script>

<div class="m-auto w-full" class:dark>
	<div class="mb-2">
		<label for="configType">
			<span>Config Type:</span>
		</label>

		<select
			class="select select-sm rounded dark:text-slate-700"
			id="configType"
			bind:value={configType}
			required
		>
			{#each Object.keys(ShiftLightConfigs) as type}
				<option>{type}</option>
			{/each}
		</select>
	</div>

	<hr class="mb-2" />

	<!-- Our form for out version the shiftlight is configured for -->
	<form on:submit|preventDefault={update} class="grid grid-cols-3 gap-4 max-w-xl m-auto">
		{#each Object.keys(inputOptions) as input}
			<div class="col-span-1 flex items-center justify-start">
				<label for={input}>
					<span>{input}:</span>
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
						bind:value={configCopy[inputOptions[input]['code']]}
						class="dark:text-slate-700 rounded p-2 w-1/2 border"
						id={inputOptions[input]['code']}
						required
					/>
				{:else}
					<select
						class="dark:text-slate-700 rounded w-1/2"
						id={inputOptions[input]['code']}
						bind:value={configCopy[inputOptions[input]['code']]}
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
			<button class="rounded border dark:bg-white dark:text-slate-700 p-1">Update</button>
		</div>
	</form>
</div>
