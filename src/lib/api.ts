import { invoke } from '@tauri-apps/api/core';
import { get } from 'svelte/store';
import { session, port } from '$stores/session';
import { AllCommands, sessionConfig, type SessionConfig } from '$types/config';
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
Load the config, returns a `SessionConfig` instance.
	*/
export async function getCurrentConfig() {
	const keys = { cmd: 'VER' };

	Object.keys(sessionConfig).forEach((key) => {
		keys[key] = AllCommands.find((command) => command.cmd === key);
	});

	const new_config: { [key: string]: string | boolean | number } = {};

	for (const key in keys) {
		const command = keys[key];

		const res = await invoke('write', {
			content: command.cmd + '\n'
		})
			// Errors get pushed into the resulting config?
			.catch((err: SerialError) => {
				if (typeof err === 'string') {
					err = JSON.parse(err);
				}
				error(err.message);
			});

		if (typeof res === 'string' || typeof res === 'number' || typeof res === 'boolean') {
			new_config[command.cmd] = res;
		} else {
			error("Invalid response from 'write' command");
		}
	}
	return new_config;
}

/*
Takes a configuration object and writes it to the serial
port currently connected.
	
Returns an object{ error: [], success: [] }
*/
export async function submitConfig(config: SessionConfig, port_name: string) {
	const results = {
		success: [],
		error: []
	};

	for (const key in config) {
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
