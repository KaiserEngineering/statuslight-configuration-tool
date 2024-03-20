import { z } from 'zod';
import { sessionConfig } from '$types/config';

export const formSchema = z.object(sessionConfig);

export type FormSchema = typeof formSchema;
