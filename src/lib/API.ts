import { invoke } from '@tauri-apps/api';
import { ShiftLightConfigs } from './Config';
import type { SerialError, SLConfig } from 'src/app';

export type Port = {
	port_name: string;
	port_info: string;
};

export async function getCurrentConnection() {
	return await invoke('get_connection', {});
}

export async function connectToSerialPort(portName: string) {
	return await invoke('connect', {
		portName
	});
}

/*
Load the config for the provided config type.

Return the new config object.
*/
export async function getCurrentConfig() {
	return await invoke('write', {
		content: 'CONFIG\n'
	})
		.then(async (configType: any) => {
			configType = configType == 0 ? "RPM" : "Boost";
			const keys = JSON.parse(JSON.stringify({
				...ShiftLightConfigs["All"],
				...ShiftLightConfigs[configType]
			}));

			// Stash current firmware version
			keys.VERSION = {
				code: 'VER'
			};

			const new_config: SLConfig = {};
			for (const key in keys) {
				await invoke('write', {
					content: keys[key]['code'] + '\n'
				})
					.then((res: any) => {
						new_config[keys[key]['code']] = res;
					})
					// Errors get pushed into the resulting config?
					.catch((error: SerialError) => {
						new_config[keys[key]['code']] = error.message;
					});
			}
			new_config.CONFIG = configType;
			return new_config;
		})
		.catch((error) => {
			throw error.message;
		});
}

export async function getSerialPorts() {
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
export async function submitConfig(
	config: typeof ShiftLightConfigs['RPM'] | typeof ShiftLightConfigs['Boost'],
	port_name: string
) {

	const results = {
		success: [],
		error: []
	};

	for (const key in config) {
		if (key == "VER") {
			continue;
		}
		await invoke('write', {
			portName: port_name,
			content: key + ' ' + config[key] + '\n'
		})
			.then((res: any) => {
				results['success'].push(res);
			})
			.catch((err: SerialError) => {
				results['error'].push(err.message);
			});
	}
	return results;
}
