import { invoke } from '@tauri-apps/api';
import { ShiftLightConfigs } from './Config';

export type Port = {
	port_name: string;
	port_info: string;
};

export async function connect_to_serial_port(portName: String) {
	return await invoke('connect', {
		portName
	});
}

/*
Load the config for the provided config type.

Return the new config object.
*/
export async function load_current_config() {
	return await invoke('write', {
		content: 'VER\n'
	})
		.then(async (version) => {
			const keys = ShiftLightConfigs[version];

			const new_config = {};
			for (const key in keys) {
				await invoke('write', {
					content: keys[key]['code'] + '\n'
				})
					.then((res) => {
						new_config[keys[key]['code']] = res;
					})
					// Errors get pushed into the resulting config?
					.catch((error) => {
						new_config[keys[key]['code']] = error.message;
					});
			}
			new_config['configType'] = 'RPM';
			return new_config;
		})
		.catch((error) => {
			throw error.message;
		});
}

export async function get_serial_ports() {
	return await invoke('find_available_ports')
		// `invoke` returns a Promise
		.then((response) => {
			return response;
		})
		.catch((error) => {
			throw error.message;
		});
}

/*
Takes a configuration object and writes it to the serial
port currently connected.

Returns an object{ error: [], success: [] }
*/
export async function submit_config(
	config: typeof ShiftLightConfigs['RPM'] | typeof ShiftLightConfigs['Boost'],
	port_name: string
) {
	const results = {
		success: [],
		error: []
	};
	for (const key in config) {
		await invoke('write', {
			portName: port_name,
			content: key + ' ' + config[key] + '\n'
		})
			.then((res) => {
				results['success'].push(res);
			})
			.catch((err) => {
				results['error'].push(err.message);
			});
	}
	return results;
}
