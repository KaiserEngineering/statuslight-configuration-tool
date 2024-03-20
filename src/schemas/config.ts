import { z } from 'zod';

export const commandSchema = z.object({
	cmd: z.string().refine((v) => v, { message: 'No CMD value provided for command' }),
	name: z.string(),
	desc: z.string(),
	type: z.string(),
	dataType: z.string(),
	default: z.coerce.number().or(z.string()),
	options: z.optional(z.array(z.string())),
	min: z.coerce.number(),
	max: z.coerce.number(),
	EEBytes: z.coerce.number(),
	appConfig: z.string(),
	limit: z.optional(z.string()),
	fieldType: z.string(),
	UserConfig: z.string(),
	AdvConfig: z.string(),
	ParamType: z.string(),
	readWrite: z.string(),
	VERSION: z.optional(z.string()),
	write_func: z.optional(z.string()),
	read_func: z.optional(z.string())
});

export type CommandSchema = typeof commandSchema;
