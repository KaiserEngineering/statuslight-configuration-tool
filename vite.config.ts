import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { resolve } from "path";

const config: UserConfig = {
	plugins: [sveltekit()]
};

export default config;
