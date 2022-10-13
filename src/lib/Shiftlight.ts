import { invoke } from '@tauri-apps/api';
import { ShiftLightConfigs } from './Config';

export class Port {
	port_name: string | undefined;
	port_info: string | undefined;
}

export class ShiftLight {
	port: Port | undefined;
	config_type: string | undefined;
	loaded_config: Record<string, unknown> | undefined;

	async load_current_config() {
		await invoke('close_active_port', {}).catch((err) => {
			throw new err();
		});

		this.loaded_config;

		if (this.port) {
			const port_name = this.port.port_name;
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
					this.loaded_config = new_config;
				})
				.catch((error) => {
					throw error.message;
				});
		} else {
			throw 'No port found for ShiftLight session';
		}
	}
}
