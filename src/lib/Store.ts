import { writable } from 'svelte/store';

export class Session {
	public ui_data = {
		configType: undefined,
		config: {},
		loading: false,
		port: undefined,
		darkTheme: false
	};
}

const session = new Session();
export const shiftlight_store = writable<Session['ui_data']>(session.ui_data);
