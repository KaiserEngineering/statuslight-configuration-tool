import { writable } from 'svelte/store';
import type { ShiftLightConfigs } from '../lib/Config';

export class Session {
	public ui_data = {
		configType: undefined,
		config: {},
		loading: false,
		port: undefined,
		darkTheme: false
	};

	public config: typeof ShiftLightConfigs['RPM'] | typeof ShiftLightConfigs['Boost'] = {};
}

const sessionObj = new Session();

export const session = writable<Session['ui_data']>(sessionObj.ui_data);
export const config = writable<Session['config']>(sessionObj.config);
