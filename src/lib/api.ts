import { invoke } from '@tauri-apps/api/core';
import { get } from 'svelte/store';
import { session, port } from '$stores/session';
import { BoostConfigs, RPMConfigs, type SLCconfigEntry } from './config';
import { error } from '$lib/toasts';

export type Port = {
	port_name: string;
	product_name: string;
};

/*
Create new conection

Calls drop_connection and then connectToSerialPort requires the port
store to be set.

Returns nothing.
*/
export async function newConnection() {
	let sessionObj = get(session);
	let portObj = get(port);

	if (!portObj || !portObj.port_name) {
		throw 'Could not create new connection as port is not selected';
	}

	session.set({
		...sessionObj,
		loading: true
	});

	const existingConnection = await invoke('get_connection', {}).catch((_err) => {
		return undefined;
	});

	if (existingConnection) {
		await invoke('drop_connection', {});
	}
	if (portObj && portObj.port_name) {
		await connectToSerialPort(portObj.port_name);
	}

	session.set({
		...sessionObj,
		loading: false
	});
}

export async function getCurrentConnection() {
	return await invoke('get_connection', {}).catch((_) => {
		invoke('drop_connection', {}).catch((err) => {
			if (typeof err === 'string') {
				err = JSON.parse(err);
			}
			throw `Could not get current connection ${err.message}`;
		});
	});
}

export async function connectToSerialPort(portName: string) {
	return await invoke('connect', {
		portName
	}).catch((err) => {
		if (typeof err === 'string') {
			err = JSON.parse(err);
		}
		throw `Could not connect to port ${err.message}`;
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
			configType = configType == 0 ? 'RPM' : 'Boost';
			const keys = Object.keys(configType == 'RPM' ? RPMConfigs : BoostConfigs);

			// Stash current firmware version
			keys.VERSION = {
				code: 'VER'
			};

			const new_config: { [key: string]: SLCconfigEntry } = {};
			for (const key in keys) {
				if (key == 'CONFIG') {
					continue;
				}

				await invoke('write', {
					content: keys[key]['code'] + '\n'
				})
					.then((res: any) => {
						new_config[keys[key]['code']] = res;
					})
					// Errors get pushed into the resulting config?
					.catch((err: SerialError) => {
						if (typeof err === 'string') {
							err = JSON.parse(err);
						}
						new_config[keys[key]['code']] = error.message;
					});
			}
			new_config.CONFIG = configType;
			return new_config;
		})
		.catch((err) => {
			if (typeof err === 'string') {
				err = JSON.parse(err);
			}
			throw err.message;
		});
}

/*
Takes a configuration object and writes it to the serial
port currently connected.
	
Returns an object{ error: [], success: [] }
*/
export async function submitConfig(
	config: typeof RPMConfigs | typeof BoostConfigs,
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

		await invoke('write', {
			portName: port_name,
			content: key + ' ' + config[key] + '\n'
		})
			.then((res: any) => {
				results['success'].push(res);
			})
			.catch((err: SerialError) => {
				if (typeof err === 'string') {
					err = JSON.parse(err);
				}

				results['error'].push(err.message);
			});
	}
	return results;
}
