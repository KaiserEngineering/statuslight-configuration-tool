<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { AllCommands, sessionConfig } from '$types/config';

	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/label/label.svelte';
	import { formSchema, type FormSchema } from '$schemas/editSchema';

	import { submitConfig } from '$lib/api';
	import { session, config, port, connected } from '$stores/session';
	import { success, error, info } from '$lib/toasts';
	import SelectField from '$components/form/SelectField.svelte';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		SPA: true,
		validators: zodClient(formSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				if (!$connected) {
					error("You're not connected to your ShiftLight!");
					return;
				}
				$session.loading = true;
				// Only grab the fields that were changed from the current value
				let updatedFields: { [key: string]: string } = {};
				Object.keys(keys).forEach((key) => {
					if (isTainted($tainted[key])) {
						updatedFields[key] = form.data[key];
					}
				});

				if (Object.keys(updatedFields).length == 0) {
					info('Nothing to update');
					$session.loading = false;
				} else if ($port !== null) {
					await submitConfig(updatedFields, $port.port_name)
						.then((results) => {
							if (results.error.length > 0) {
								let error_message: string = '';
								results.error.forEach((error) => {
									error_message += `${error}\n`;
								});
								error(error_message);
							} else {
								// $config = Object.assign({}, form.data);
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
			} else {
				error('Invalid data!');
			}
		}
	});

	const { form: formData, enhance, isTainted, tainted } = form;

	const keys = Object.keys(sessionConfig).map((key) => ({
		[key]: AllCommands.find((command) => command.cmd === key)
	}));

	function setFormBasedOnConfig() {
		if (!isTainted()) {
			formData.update(
				($form) => {
					for (const keyObject of keys) {
						const key = Object.keys(keyObject)[0];
						const command = keyObject[key];

						if ($config[command.cmd] !== undefined) {
							$form[command.cmd] = $config[command.cmd];
						}
					}
					return $form;
				},
				{ taint: false }
			);
		}
	}

	$: $config, setFormBasedOnConfig();
</script>

{#if !$session.loading}
	<form method="POST" use:enhance class="text-center w-1/4 text-xl inline-grid grid-cols-1 gap-4">
		{#each Object.keys(sessionConfig) as key}
			{@const command = AllCommands.find((command) => command.cmd === key)}
			{@const name = command.cmd}
			<Form.Field {form} {name}>
				<Form.Control let:attrs>
					{#if command.type === 'list'}
						<SelectField {command} bind:data={$formData} {attrs} />
					{:else}
						<Label>{command.name}</Label>
						<Input
							{...attrs}
							name={command.cmd}
							type={command.type}
							bind:value={$formData[command.cmd]}
							class="border-2 border-solid border-gray-500"
						/>
					{/if}
				</Form.Control>
				<Form.Description>{command.desc}</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		{/each}

		<Form.Button variant="secondary" class="bg-gray-500">Update Config</Form.Button>
	</form>
{:else}
	Loading in progress...
{/if}
