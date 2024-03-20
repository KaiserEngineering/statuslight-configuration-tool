<script lang="ts">
	import * as Select from '$components/ui/select';
	import type { Infer } from 'sveltekit-superforms';
	import type { CommandSchema } from '$schemas/config';

	export let command: Infer<CommandSchema>;
	export let value;
	export let attrs: {
		name: string;
		id: string;
		'data-fs-error': string;
		'aria-describedby': string;
		'aria-invalid': 'true';
		'aria-required': 'true';
		'data-fs-control': string;
	};

	$: selectedValue = value
		? {
				label: command.options[value],
				value: value
			}
		: undefined;
</script>

<Select.Root
	{...attrs}
	selected={selectedValue}
	onSelectedChange={(v) => {
		v && (value = v.value);
	}}
>
	<Select.Trigger
		class="text-black hover:!bg-nord7 dark:bg-nord6
	border border-nord9 border-solid border-2 w-1/2"
	>
		<Select.Value placeholder={command.name} />
	</Select.Trigger>
	<Select.Content>
		{#each command.options as option, i}
			<Select.Item value={i}>{option}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
