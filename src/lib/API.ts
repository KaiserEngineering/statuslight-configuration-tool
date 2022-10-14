// Handle sending to ourbackend
import { invoke } from '@tauri-apps/api';
import type { ShiftLight } from './Store';

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
export async function submit_config(shift_light: ShiftLight) {
	const results = {
		success: [],
		error: []
	};
	for (const key in shift_light.ui_data.config) {
		await invoke('write', {
			portName: shift_light.ui_data.port.port_name,
			content: key + ' ' + shift_light.ui_data.config[key] + '\n'
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
