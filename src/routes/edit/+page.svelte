<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { AllCommands } from '$types/config';

	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	import { formSchema, type FormSchema } from '$schemas/editSchema';

	import { submitConfig } from '$lib/api';
	import { session, config, port, connected } from '$stores/session';
	import { success, error, info } from '$lib/toasts';

	export let data: SuperValidated<Infer<FormSchema>>;
	const form = superForm(data, {
		dataType: 'json',
		SPA: true,
		validators: zodClient(formSchema),
		onUpdate({ form }) {
			if (!$connected) {
				error("You're not connected to your ShiftLight!");
				return;
			}
			$session.loading = true;
			// Only grab the fields that were changed from the current value
			let updatedFields: { [key: string]: any } = {};
			Object.keys(form.data).forEach((key) => {
				if ($config[key] !== form[key]) {
					updatedFields[key] = form[key];
				}
			});
			if (Object.keys(updatedFields).length == 0) {
				info('Nothing to update');
				$session.loading = false;
			} else if ($port !== null) {
				submitConfig(updatedFields, $port.port_name)
					.then((results) => {
						if (results.error.length > 0) {
							let error_message: string = '';
							results.error.forEach((error) => {
								error_message += `${error}\n`;
							});
							error(error_message);
						} else {
							$config = Object.assign({}, form.data);
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
		}
	});
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	{#each AllCommands as command}
		{@const name = command.cmd}
		{#if name && command.appConfig == 'Yes'}
			<Form.Field {form} {name}>
				<Form.Control let:attrs>
					{#if command.type === 'list'}
						<Select.Root {...attrs}>
							<Select.Trigger>
								<Select.Value placeholder={command.name} />
							</Select.Trigger>
							<Select.Content>
								{#each command.options as option}
									<Select.Item value={option}>{option}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{:else}
						<Label>{command.name}</Label>
						<Input
							{...attrs}
							name={command.cmd}
							type={command.type}
							bind:value={formData[command.cmd]}
						/>
					{/if}
				</Form.Control>
				<Form.Description>{command.desc}</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		{/if}
	{/each}

	<Form.Button>Update Config</Form.Button>
</form>
