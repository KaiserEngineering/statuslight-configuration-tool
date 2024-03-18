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
				let updatedFields: { [key: string]: number } = {};

				for (const keyObject of keys) {
					const key = Object.keys(keyObject)[0];

					// Convert form value from hex to number
					const formValue: number = parseInt(form.data[key], 16);

					// Always convert form to number for select string values
					if ($config[key] !== formValue) {
						updatedFields[key] = formValue;
					}
				}

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
								$config = { ...$config, ...updatedFields };
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
		formData.update(
			($form) => {
				for (const keyObject of keys) {
					const key = Object.keys(keyObject)[0];
					const command = keyObject[key];

					if ($config[command.cmd] !== undefined) {
						if (command.type === 'list') {
							$form[command.cmd] = $config[command.cmd];
						} else {
							$form[command.cmd] = Number($config[command.cmd]).toString(16);
						}
					}
				}
				return $form;
			},
			{ taint: false }
		);
	}
</script>

<form
	method="POST"
	use:enhance
	class="text-center m-4 inline-grid grid-cols-1 gap-4 bg-white dark:bg-gray-400 shadow-md rounded px-8 pt-6 pb-8 mb-4"
>
	<!-- <SuperDebug data={{ $formData, $tainted }} display={dev} /> -->

	{#each Object.keys(sessionConfig) as key}
		{@const command = AllCommands.find((command) => command.cmd === key)}
		{@const name = command.cmd}
		<Form.Field {form} {name}>
			<Form.Control let:attrs>
				<Label class="text-black">{command.name}</Label>
				{#if command.type === 'list'}
					<SelectField {command} bind:value={$formData[command.cmd]} {attrs} />
					<input hidden bind:value={$formData[command.cmd]} name={attrs.name} />
				{:else}
					<Input
						{...attrs}
						name={command.cmd}
						type="text"
						bind:value={$formData[command.cmd]}
						class="border-2 border-solid border-gray-500 uppercase bg-transparent"
					/>
				{/if}
			</Form.Control>
			<Form.Description class="text-black">{command.desc}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{/each}

	<Form.Button disabled={$session.loading} variant="default">Update Config</Form.Button>
</form>

<Form.Button on:click={setFormBasedOnConfig} disabled={$session.loading} variant="secondary"
	>Load Config Values</Form.Button
>
