import { invoke } from '@tauri-apps/api';
import { get } from 'svelte/store';
import { session, port } from '$lib/stores';
import { ShiftLightConfigs } from './config';
import { error } from '$lib/toasts';

export type Port = {
	port_name: string;
	port_info: string;
};

export async function newConnection() {
	let sessionObj = get(session);
	let portObj = get(port);

	session.set({
		...sessionObj,
		loading: true,
	});

	await invoke('plugin:serial|drop_connection', {}).then(async () => {
		if (portObj && portObj.port_name) {
			await connectToSerialPort(portObj.port_name).catch((err) => {
				error(err.message);

				session.set({
					...sessionObj,
					loading: false,
				});
			});
		}
	}).catch((err: SerialError) => {
		error(err.message);

		session.set({
			...sessionObj,
			loading: false,
		});
	});

	session.set({
		...sessionObj,
		loading: false,
	});
}

export async function getCurrentConnection() {
	return await invoke('plugin:serial|get_connection', {}).catch((_) => {
		invoke('plugin:serial|drop_connection', {}).catch((err) => {
			throw err;
		});
	});
}

export async function connectToSerialPort(portName: string) {
	return await invoke('plugin:serial|connect', {
		portName
	});
}

/*
Load the config for the provided config type.
	
Return the new config object.
*/
export async function getCurrentConfig() {
	return await invoke('plugin:serial|write', {
		content: 'CONFIG\n'
	})
		.then(async (configType: any) => {
			configType = configType == 0 ? 'RPM' : 'Boost';
			const keys = JSON.parse(
				JSON.stringify({
					...ShiftLightConfigs['All'],
					...ShiftLightConfigs[configType]
				})
			);

			// Stash current firmware version
			keys.VERSION = {
				code: 'VER'
			};

			const new_config: SLConfig = {};
			for (const key in keys) {
				if (key == 'CONFIG') {
					continue;
				}

				await invoke('plugin:serial|write', {
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
			if (error.message) {
				throw error;
			} else {
				throw error;
			}
		});
}

/*
Takes a configuration object and writes it to the serial
port currently connected.
	
Returns an object{ error: [], success: [] }
*/
export async function submitConfig(
	config: (typeof ShiftLightConfigs)['RPM'] | (typeof ShiftLightConfigs)['Boost'],
	port_name: string
) {
	const results = {
		success: [],
		error: []
	};

	for (const key in config) {
		if (key === 'VER') {
			continue;
		}
		if (key === 'CONFIG') {
			config[key] = config[key] == 'RPM' ? 0 : 1;
		}

		await invoke('plugin:serial|write', {
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
