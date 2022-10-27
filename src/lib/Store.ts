import { writable } from 'svelte/store';
import { appWindow } from '@tauri-apps/api/window';
import type { ShiftLightConfigs } from '../lib/Config';
import { listen } from '@tauri-apps/api/event';

// listen to the `click` event and get a function to remove the event listener
// there's also a `once` function that subscribes to an event and automatically unsubscribes the listener on the first event
let unlisten;
async function setup_listeners() {
	unlisten = await listen('MySuperEvent', (event) => {
		// event.event is the event name (useful if you want to use a single callback fn for multiple event types)
		// event.payload is the payload object
		console.log('Custom event found! ' + JSON.stringify(event));
	});
}
setup_listeners();

export class Session {
	public ui_data = {
		configType: undefined,
		config: {},
		loading: false,
		port: undefined,
		darkTheme: false
	};

	public config: typeof ShiftLightConfigs['RPM'] | typeof ShiftLightConfigs['Boost'] = {};

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
export const config = writable<Session['config']>(sessionObj.config);
