import type { PageLoad } from './$types';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { commandSchema, type CommandSchema } from '$schemas/config';

export const load: PageLoad = async () => {
	const form: SuperValidated<Infer<CommandSchema>> = await superValidate(zod(commandSchema));

	return { form };
};
