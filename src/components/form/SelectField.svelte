<script lang="ts">
	import * as Select from '$components/ui/select';

	import type { Infer } from 'sveltekit-superforms';

	import type { CommandSchema } from '$schemas/config';

	export let command: Infer<CommandSchema>;
	export let data;
	export let attrs;

	$: selectedValue = $data.form.data[command.cmd]
		? {
				label: $data.form.data[command.cmd],
				value: $data.form.data[command.cmd]
			}
		: undefined;
</script>

<Select.Root {...attrs} selected={selectedValue}>
	<Select.Trigger>
		<Select.Value placeholder={command.name} />
	</Select.Trigger>
	<Select.Content>
		{#each command.options as option}
			<Select.Item value={option}>{option}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
