<script lang="ts">
	import { submit_config } from '../lib/API';
	import { shiftlight_store } from '../lib/Store';
	import { success, error } from '../lib/Toasts';
	import { ShiftLightConfigs } from '../lib/Config';

	async function update(): Promise<void> {
		$shiftlight_store.loading = true;
		submit_config($shiftlight_store)
			.then((results) => {
				if (results.error.length > 0) {
					error(JSON.stringify(results.error));
				} else {
					$shiftlight_store.config = results;
					success('Config updated');
				}
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => {
				$shiftlight_store.loading = false;
			});
	}

	let configCopy = $shiftlight_store.config;
	let configType = $shiftlight_store.configType || '';
	$: inputOptions = ShiftLightConfigs[configType] || {};

	$: dark = $shiftlight_store.darkTheme;
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
		>
			{#each Object.keys(ShiftLightConfigs) as type}
				<option>{type}</option>
			{/each}
		</select>
	</div>

	<hr class="mb-2" />

	<!-- Our form for out version the shiftlight is configured for -->
	<div class="grid grid-cols-3 gap-4 max-w-xl m-auto">
		{#each Object.keys(inputOptions) as input}
			<div class="col-span-1">
				<label for={input}>
					<span>{input}:</span>
				</label>
			</div>

			<div class="col-span-2">
				{#if typeof inputOptions[input]['type'] == 'string'}
					<input
						bind:value={configCopy[inputOptions[input]['code']]}
						class="dark:text-slate-700 rounded p-2 w-1/2 border"
						id={inputOptions[input]['code']}
					/>
				{:else}
					<select
						class="dark:text-slate-700 rounded w-1/2"
						id={inputOptions[input]['code']}
						bind:value={configCopy[inputOptions[input]['code']]}
					>
						{#each inputOptions[input]['type'] as option}
							<option value={option['value']}>{option['label']}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}
	</div>

	<div class="flex justify-end">
		<button class="rounded dark:bg-white dark:text-slate-700 p-1" on:click={update}>Update</button>
	</div>
</div>
