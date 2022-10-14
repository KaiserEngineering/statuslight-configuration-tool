<script lang="ts">
	import { submit_config } from '../lib/API';
	import { shiftlight_store } from '../lib/Store';
	import { success, error } from '../lib/Toasts';
	import { ShiftLightConfigs } from '../lib/Config';

	async function update(): Promise<void> {
		$shiftlight_store.ui_data.loading = true;
		submit_config($shiftlight_store)
			.then((results) => {
				if (results.error.length > 0) {
					error(JSON.stringify(results.error));
				} else {
					$shiftlight_store.ui_data.config = results;
					success('Config updated');
				}
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => {
				$shiftlight_store.ui_data.loading = false;
			});
	}

	let config_copy = $shiftlight_store.ui_data.config;
	let config_type = $shiftlight_store.ui_data.config_type || '';
	$: input_options = ShiftLightConfigs[config_type] || {};

	$: dark = $shiftlight_store.ui_data.darkTheme;

	$: console.log($shiftlight_store);
</script>

<div class="m-auto w-full" class:dark>
	<div class="mb-2">
		<label for="config_type">
			<span>Config Type:</span>
		</label>

		<select
			class="select select-sm rounded dark:text-slate-700"
			id="config_type"
			bind:value={config_type}
		>
			{#each Object.keys(ShiftLightConfigs) as type}
				<option>{type}</option>
			{/each}
		</select>
	</div>

	<hr class="mb-2" />

	<!-- Our form for out version the shiftlight is configured for -->
	<div class="grid grid-cols-3 gap-4 max-w-xl m-auto">
		{#each Object.keys(input_options) as input}
			<div class="col-span-1">
				<label for={input}>
					<span>{input}:</span>
				</label>
			</div>

			<div class="col-span-2">
				{#if typeof input_options[input]['type'] == 'string'}
					<input
						bind:value={config_copy[input_options[input]['code']]}
						class="dark:text-slate-700 rounded p-2 w-1/2"
						id={input_options[input]['code']}
					/>
				{:else}
					<select
						class="dark:text-slate-700 rounded w-1/2"
						id={input_options[input]['code']}
						bind:value={config_copy[input_options[input]['code']]}
					>
						{#each input_options[input]['type'] as option}
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
