<script lang="ts">
	import { config } from '$lib/Store';
	import Fa from 'sveltejs-fontawesome';
	import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

	// Handle rendering UI for editing components based on
	// the field Type value.
	export let fieldType: string;
	export let dark: boolean;
	export let inputOptions;

	let groupings = {};
	Object.keys(inputOptions).forEach((input: any) => {
		let inputOption = inputOptions[input];

		if (
			(fieldType === 'advanced' && inputOption.fieldType != 'Basics') ||
			inputOption.fieldType.toLowerCase() === fieldType
		) {
			if (groupings[inputOption.fieldType]) {
				groupings[inputOption.fieldType].push([input]);
			} else {
				groupings[inputOption.fieldType] = [input];
			}
		}
	});
</script>

<div class="columns-1">
	{#each Object.keys(groupings) as grouping}
		{#if groupings[grouping].length > 0}
			<h2 class="text-2xl underline">
				{grouping}:
			</h2>

			<div class="grid grid-cols-2 gap-4">
				{#each groupings[grouping] as input}
					<div class="flex">
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
					{#if typeof inputOptions[input]['type'] == 'string'}
						<input
							max={inputOptions[input]['max']}
							min={inputOptions[input]['min']}
							type="number"
							bind:value={$config[inputOptions[input]['code']]}
							class="input w-1/2 p-2"
							id={inputOptions[input]['code']}
							required
						/>
					{:else}
						<select
							class="input w-1/2"
							id={inputOptions[input]['code']}
							bind:value={$config[inputOptions[input]['code']]}
							required
						>
							{#each inputOptions[input]['type'] as option}
								<option value={option['value']}>{option['label']}</option>
							{/each}
						</select>
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
</div>
