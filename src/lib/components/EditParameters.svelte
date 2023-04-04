<script lang="ts">
	import { infoCircle } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';

	export let config: any;
	export let groupings: any = {};
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
								<span>{inputOption.value}:</span>
							</label>

							<!-- svelte-ignore a11y-missing-attribute -->
							<span
								data-bs-toggle="tooltip"
								data-bs-placement="top"
								title={inputOption.info}
								class="ml-1 cursor-pointer content-center"
							>
								<Icon data={infoCircle} scale={0.75} />
							</span>
						</div>
						{#if typeof inputOption.type === 'string'}
							{#if inputOption.type === 'number'}
								<input
									max={inputOption.max}
									min={inputOption.min}
									type="number"
									bind:value={config[inputOption.code]}
									class="input w-1/2 p-2 ke-input"
									id={inputOption.code}
									required
								/>
							{:else}
								<div class="form-check">
									<input
										class="ke-checkbox border-gray-200"
										type="checkbox"
										bind:value={config[inputOption.code]}
										id={inputOption.code}
									/>
								</div>
							{/if}
						{:else}
							<select
								class="ke-input ke-select"
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
