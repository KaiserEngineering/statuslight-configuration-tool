import { writable } from 'svelte/store';
import { appWindow } from '@tauri-apps/api/window';
import type { ShiftLightConfigs } from '../lib/Config';
import type { Port } from './API';

export class Session {
	public ui_data = {
		loading: false,
		darkTheme: false,
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
export const config = writable<typeof ShiftLightConfigs['RPM'] | typeof ShiftLightConfigs['Boost']>({});
export const port = writable<undefined | Port>();
