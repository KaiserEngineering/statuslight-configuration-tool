import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { internalIpV4 } from 'internal-ip';

export default defineConfig(async () => {
	const host = await internalIpV4();

	const config: UserConfig = {
		plugins: [sveltekit()],
		server: {
			host: 'localhost', // listen on all addresses
			port: 5173,
			strictPort: true,
			hmr: {
				protocol: 'ws',
				host,
				port: 5183
			}
		}
	};
	return config;
});
