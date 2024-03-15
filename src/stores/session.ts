import { writable, type Writable } from 'svelte/store';

import type { SessionConfig } from '$types/config';
import type { Port } from '$lib/api';

export class Session {
	public ui_data = {
		loading: false,
		darkTheme: false
	};

	async setDarkThemeFromSystem() {
		// Currently the getting system theme hook is broken :/
		return true;
	}
}

const sessionObj = new Session();
sessionObj.setDarkThemeFromSystem().then((darkTheme) => (sessionObj.ui_data.darkTheme = darkTheme));

export const session = writable<Session['ui_data']>(sessionObj.ui_data);

type SessionConfigWithVer = SessionConfig & { VER: string };

export const config = writable<SessionConfigWithVer>({ VER: '' });

export const port: Writable<Port> = writable({
	product_name: '',
	port_name: ''
});

export const ports: Writable<Port[] | []> = writable([]);

export const connected: Writable<boolean> = writable(false);
