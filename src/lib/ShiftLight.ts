import { invoke } from '@tauri-apps/api';
import { ShiftLightConfigs } from './Config';
import { shiftlight_store } from './Store';
import { get } from 'svelte/store';

export type Port = {
	port_name: string;
	port_info: string;
};

/*
Load the config for the provided config type.

Return a Session.config object.
*/
export async function load_current_config() {
	await invoke('close_active_port', {}).catch((err) => {
		throw new err();
	});

	const session = get(shiftlight_store);

	if (!session.port) {
		throw new Error('Invalid state');
	}

	const port_name = session.port.port_name;

	return await invoke('write', {
		portName: port_name,
		content: 'VER\n'
	})
		.then(async (version) => {
			const keys = ShiftLightConfigs[version.replace('\n', '')];

			const new_config = {};
			for (const key in keys) {
				await invoke('write', {
					portName: port_name,
					content: keys[key]['code'] + '\n'
				})
					.then((res) => {
						new_config[keys[key]['code']] = res.replace('\n', '');
					})
					.catch((error) => {
						throw error.message;
					});
			}
			new_config['configType'] = 'RPM';
			return new_config;
		})
		.catch((error) => {
			throw error.message;
		});
}
