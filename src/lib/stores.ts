import { writable, type Writable } from 'svelte/store';
import type { ShiftLightConfigs } from './config';
import type { Port } from './api';

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
sessionObj.ui_data.darkTheme = sessionObj.setDarkThemeFromSystem();

export const session = writable<Session['ui_data']>(sessionObj.ui_data);
export const config = writable<
	(typeof ShiftLightConfigs)['RPM'] | (typeof ShiftLightConfigs)['Boost']
>({});
export const port: Writable<Port> = writable({
	port_info: '',
	port_name: ''
});
export const ports: Writable<[Port] | []> = writable([]);
export const connected: Writable<boolean> = writable(false);
