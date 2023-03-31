import { writable, type Writable, derived } from 'svelte/store';
import { appWindow } from '@tauri-apps/api/window';
import type { ShiftLightConfigs } from './config';
import type { Port } from './api';

export class Session {
	public ui_data = {
		loading: false,
		darkTheme: false
	};

	async setDarkThemeFromSystem() {
		this.ui_data.darkTheme = await appWindow.theme().then((value) => {
			if (value == 'dark') {
				return true;
			}
			return false;
		});
	}
}

const sessionObj = new Session();
sessionObj.setDarkThemeFromSystem();

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
