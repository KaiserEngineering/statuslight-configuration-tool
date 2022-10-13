// Handle sending to ourbackend
import { invoke } from '@tauri-apps/api';
import { get } from 'svelte/store';
import { shiftlight } from './Store';

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
export async function submit_config(config: Record<string, unknown>) {
	const results = {
		success: [],
		error: []
	};
	for (const key in config) {
		await invoke('write', {
			portName: get(shiftlight).port.port_name,
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
