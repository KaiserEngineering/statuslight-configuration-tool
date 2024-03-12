<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { AllCommands } from '$types/config';

	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	import { formSchema, type FormSchema } from '$schemas/editSchema';

	// import { getCurrentConfig, submitConfig } from '$lib/api';
	// import { session, config, port, connected } from '$stores/session';
	// import { success, error, info } from '$lib/toasts';

	// $: $connected, $connected ? (configCopy = Object.assign({}, $config)) : '';

	export let data: SuperValidated<Infer<FormSchema>>;
	const form = superForm(data, {
		dataType: 'json',
		SPA: true,
		validators: zodClient(formSchema),
		onUpdate({ form }) {
			console.log(form);
		}
	});
	const { form: formData, enhance } = form;

	// let configCopy = Object.assign({}, $config);

	// const inputOptions = {
	// 	basics: RPMConfigs,
	// 	advanced: BoostConfigs
	// }[configCopy.configType];

	// async function update(): Promise<void> {
	// 	if (!$connected) {
	// 		error("You're not connected to your ShiftLight!");
	// 		return;
	// 	}

	// 	$session.loading = true;

	// 	// Only grab the fields that were changed from the current value
	// 	let updatedFields: { [key: string]: any } = {};
	// 	Object.keys(configCopy).forEach((key) => {
	// 		if ($config[key] !== configCopy[key]) {
	// 			updatedFields[key] = configCopy[key];
	// 		}
	// 	});

	// 	if ($config.CONFIG !== configCopy.CONFIG) {
	// 		updatedFields.CONFIG = configCopy.CONFIG;
	// 	}

	// 	if (Object.keys(updatedFields).length == 0) {
	// 		info('Nothing to update');
	// 		$session.loading = false;
	// 	} else if ($port !== null) {
	// 		submitConfig(updatedFields, $port.port_name)
	// 			.then((results) => {
	// 				if (results.error.length > 0) {
	// 					let error_message: string = '';
	// 					results.error.forEach((error) => {
	// 						error_message += `${error}\n`;
	// 					});
	// 					error(error_message);
	// 				} else {
	// 					$config = Object.assign({}, configCopy);
	// 					success('Config updated');
	// 				}
	// 			})
	// 			.catch((err) => {
	// 				error(err);
	// 			})
	// 			.finally(() => {
	// 				$session.loading = false;
	// 			});
	// 		await getCurrentConfig()
	// 			.then((res) => {
	// 				$config = res;
	// 			})
	// 			.catch((err) => {
	// 				error(err.message);
	// 			});
	// 	}
	// }
</script>

<form method="POST" use:enhance>
	{#each AllCommands as command}
		{#if command.appConfig == 'Yes'}
			<Form.Field {form} name={command.cmd}>
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
						<Input {...attrs} name={command.cmd} type={command.type} />
					{/if}
				</Form.Control>
				<Form.Description>{command.desc}</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		{/if}
	{/each}

	<Form.Button>Update Config</Form.Button>
</form>
