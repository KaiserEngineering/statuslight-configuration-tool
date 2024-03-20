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

	const { form: formData, enhance } = form;

	const keys = Object.keys(sessionConfig).map((key) => ({
		[key]: AllCommands.find((command) => command.cmd === key)
	}));

	function setFormBasedOnConfig() {
		formData.update(
			($form) => {
				if ($config === undefined || $connected === false) {
					info('No device connection found');
					return $form;
				}

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
	{#each Object.keys(sessionConfig) as key}
		{@const command = AllCommands.find((command) => command.cmd === key)}
		{@const name = command.cmd}
		<Form.Field {form} {name}>
			<Form.Control let:attrs>
				<Label class="text-black">{command.name}</Label>
				<div class="flex justify-center">
					{#if command.type === 'list'}
						<SelectField {command} bind:value={$formData[command.cmd]} {attrs} />
						<input hidden bind:value={$formData[command.cmd]} name={attrs.name} />
					{:else}
						<Input
							{...attrs}
							name={command.cmd}
							type="text"
							bind:value={$formData[command.cmd]}
							class="ke-input w-1/2 uppercase"
						/>
					{/if}
				</div>
			</Form.Control>
			<div class="flex justify-center">
				<Form.Description class="text-black text-xs italic w-1/2">{command.desc}</Form.Description>
			</div>
			<Form.FieldErrors />
		</Form.Field>
	{/each}

	<div class="flex justify-center">
		<Form.Button class="ke-button" disabled={$session.loading}>Update Config</Form.Button>
	</div>
</form>

<Form.Button
	class="ke-button"
	on:click={setFormBasedOnConfig}
	disabled={$session.loading}
	variant="secondary">Load Config Values</Form.Button
>
