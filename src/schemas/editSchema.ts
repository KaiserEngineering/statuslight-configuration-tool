import { z } from 'zod';
import { AllCommands } from '$types/config';

const schemaObj = {};
AllCommands.forEach((command) => {
	if (command.appConfig === 'Yes') {
		schemaObj[command.cmd] = z.string();
	}
});

export const formSchema = z.object(schemaObj);

export type FormSchema = typeof formSchema;
