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
	<Select.Trigger class="border-2 border-solid border-gray-500">
		<Select.Value placeholder={command.name} />
	</Select.Trigger>
	<Select.Content>
		{#each command.options as option, i}
			<Select.Item value={i}>{option}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
