<script lang="ts">
	import { infoCircle } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';

	export let config: any;
	export let groupings: any = {};
	export let dark: boolean;
</script>

{#if groupings}
	<div class="columns-1">
		{#each Object.keys(groupings) as grouping}
			{#if groupings[grouping].length > 0}
				<h2 class="text-2xl underline">
					{grouping}:
				</h2>

				<div class="grid grid-cols-2 gap-4">
					{#each groupings[grouping] as inputOption}
						<div class="flex">
							<label for={inputOption.value}>
								<span class="dark:text-white">{inputOption.value}:</span>
							</label>

							<!-- svelte-ignore a11y-missing-attribute -->
							<span
								data-bs-toggle="tooltip"
								data-bs-placement="top"
								title={inputOption.info}
								class="m-1 cursor-pointer"
							>
								<Icon data={infoCircle} size="12" color={dark ? 'white' : 'black'} />
							</span>
						</div>
						{#if typeof inputOption.type === 'string'}
							{#if inputOption.type === 'number'}
								<input
									max={inputOption.max}
									min={inputOption.min}
									type="number"
									bind:value={config[inputOption.code]}
									class="input w-1/2 p-2"
									id={inputOption.code}
									required
								/>
							{:else}
								<div class="form-check">
									<input
										class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="checkbox"
										bind:value={config[inputOption.code]}
										id={inputOption.code}
									/>
								</div>
							{/if}
						{:else}
							<select
								class="input w-1/2"
								id={inputOption.code}
								bind:value={config[inputOption.code]}
								required
							>
								{#if inputOption.type && inputOption.type.length > 0}
									{#each inputOption.type as { value, label }}
										<option {value}>{label}</option>
									{/each}
								{/if}
							</select>
						{/if}
					{/each}
				</div>
			{/if}
		{/each}
	</div>
{/if}
