import type { PageLoad } from './$types';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { commandSchema, type CommandSchema } from '$schemas/config';
import { sessionConfig, AllCommands } from '$types/config';
import { get } from 'svelte/store';
import { config } from '$stores/session';

export const load: PageLoad = async () => {
	const form: SuperValidated<Infer<CommandSchema>> = await superValidate(zod(commandSchema));

	const configValue = get(config);

	const keys = Object.keys(sessionConfig).map((key) => ({
		[key]: AllCommands.find((command) => command.cmd === key)
	}));

	for (const keyObject of keys) {
		const key = Object.keys(keyObject)[0];
		const command = keyObject[key];

		form[command.cmd] = configValue[command.cmd];
	}

	return { form };
};
