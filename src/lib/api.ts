import { invoke } from '@tauri-apps/api/core';
import { get } from 'svelte/store';
import { session, port } from '$stores/session';
import { AllCommands, sessionConfig, type SessionConfig } from '$types/config';

export type Port = {
	port_name: string;
	product_name: string;
};

/**
 * Creates a new connection by dropping the existing connection (if any) and connecting to a new serial port.
 * Requires the port store to be set for the connection to be established.
 *
 * @throws {string} If the port is not selected, an error is thrown.
 */
export async function newConnection() {
	// Retrieve the current session and port objects from Svelte stores
	let sessionObj = get(session);
	let portObj = get(port);

	// Check if the port is selected
	if (!portObj || !portObj.port_name) {
		// If the port is not selected, throw an error
		throw 'Could not create a new connection as the port is not selected';
	}

	// Update the session loading status to indicate a loading state
	session.set({
		...sessionObj,
		loading: true
	});

	try {
		// Attempt to retrieve information about the existing connection
		const existingConnection = await invoke('get_connection', {});

		// If an existing connection is found, drop it
		if (existingConnection) {
			await invoke('drop_connection', {});
		}

		// If the port is selected, establish a new connection to the serial port
		if (portObj && portObj.port_name) {
			await connectToSerialPort(portObj.port_name);
		}
	} finally {
		// Reset the session loading status after the connection attempt
		session.set({
			...sessionObj,
			loading: false
		});
	}
}

/**
 * Retrieves information about the current connection from the serial port.
 * If the retrieval fails, it attempts to drop the connection and throws an error.
 *
 * @returns {Promise<void>} A Promise that resolves when the connection information is retrieved successfully.
 * @throws {string} If the retrieval or connection drop fails, an error message is thrown.
 */
export async function getCurrentConnection(): Promise<void> {
	try {
		// Attempt to retrieve information about the current connection
		await invoke('get_connection', {});
	} catch (_) {
		try {
			// If the retrieval fails, attempt to drop the connection
			await invoke('drop_connection', {});
		} catch (err) {
			// If an error occurs during the connection drop
			if (typeof err === 'string') {
				// Parse the error if it's a JSON-formatted string
				err = JSON.parse(err);
			}
			// Throw an error with a descriptive message
			throw `Could not get current connection ${err.message}`;
		}
	}
}

/**
 * Connects to the specified serial port.
 *
 * @param {string} portName - The name of the serial port to connect to.
 *
 * @returns {Promise<void>} A Promise that resolves when the connection is successful.
 * @throws {string} If the connection fails, an error message is thrown.
 */
export async function connectToSerialPort(portName: string): Promise<void> {
	try {
		// Attempt to connect to the specified serial port
		await invoke('connect', {
			portName
		});
	} catch (err) {
		// If an error occurs during the connection attempt
		if (typeof err === 'string') {
			// Parse the error if it's a JSON-formatted string
			err = JSON.parse(err);
		}

		// Throw an error with a descriptive message
		throw `Could not connect to port ${err.message}`;
	}
}

/**
 * Retrieves the current configuration from the connected serial port.
 * It iterates through sessionConfig keys, sends corresponding commands to the serial port,
 * and collects the responses to build the new configuration object.
 *
 * @returns {Promise<{ [key: string]: string | boolean | number }>} The current configuration object.
 */
export async function getCurrentConfig(): Promise<{ [key: string]: string | boolean | number }> {
	// Initialize an empty object to store command-key mappings
	const keys = Object.keys(sessionConfig).map((key) => ({
		[key]: AllCommands.find((command) => command.cmd === key)
	}));

	// Initialize an object to store the new configuration
	const new_config: { [key: string]: string | boolean | number } = {};

	const erorrs: string[] = [];
	// Iterate through the key-command pairs
	for (const keyObject of keys) {
		const key = Object.keys(keyObject)[0];
		const command = keyObject[key];

		// Send the command to the serial port and handle errors
		const res = await invoke('write', {
			content: command.cmd + '\n'
		}).catch((err: SerialError) => {
			if (typeof err === 'string') {
				err = JSON.parse(err);
			}
			erorrs.push(`Failed to write ${command.cmd} ${err.message}`);
		});

		// If the response is a string, number, or boolean, update the new configuration object
		if (typeof res === 'string' || typeof res === 'number' || typeof res === 'boolean') {
			new_config[command.cmd] = res;
		}
	}

	if (erorrs.length > 0) {
		throw erorrs.join('\n');
	}

	// Return the final configuration object
	return new_config;
}

/**
 * Writes a configuration object to the currently connected serial port.
 *
 * @param {SessionConfig} config - The configuration object to be written to the serial port.
 * @param {string} port_name - The name of the currently connected serial port.
 *
 * @returns {Promise<{ success: any[], error: string[] }>} An object containing arrays of successful and error responses.
 */
export async function submitConfig(
	config: SessionConfig,
	port_name: string
): Promise<{ success: any[]; error: string[] }> {
	// Initialize an object to store the results of the configuration submission
	const results = {
		success: [],
		error: []
	};

	// Iterate through the keys in the configuration object
	for (const key in config) {
		// Send the configuration key-value pair to the serial port and handle responses
		await invoke('write', {
			portName: port_name,
			content: key + ' ' + config[key] + '\n'
		})
			.then((res: any) => {
				// If successful, push the response to the success array
				results['success'].push(res);
			})
			.catch((err: SerialError) => {
				if (typeof err === 'string') {
					err = JSON.parse(err);
				}

				// If an error occurs, push the error message to the error array
				results['error'].push(err.message);
			});
	}

	// Return the results object containing success and error arrays
	return results;
}
