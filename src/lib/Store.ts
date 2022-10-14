import { writable } from 'svelte/store';
import { invoke } from '@tauri-apps/api';
import { ShiftLightConfigs } from './Config';

export class ShiftLight {
	private port = { port_name: undefined, port_info: undefined };

	public ui_data = {
		config_type: undefined,
		config: {},
		loading: false,
		port: undefined,
		darkTheme: 0
	};

	async load_current_config() {
		await invoke('close_active_port', {}).catch((err) => {
			throw new err();
		});

		const port_name = this.ui_data.port.port_name;

		return await invoke('write', {
			portName: port_name,
			content: 'VER\n'
		})
			.then(async (version) => {
				const keys = ShiftLightConfigs[version.replace('\n', '')];

				for (const key in keys) {
					await invoke('write', {
						portName: port_name,
						content: keys[key]['code'] + '\n'
					})
						.then((res) => {
							this.ui_data.config[keys[key]['code']] = res.replace('\n', '');
						})
						.catch((error) => {
							throw error.message;
						});
				}
				this.ui_data.config_type = 'RPM';
				return this.ui_data;
			})
			.catch((error) => {
				throw error.message;
			});
	}
}

const shiftlight_actor = new ShiftLight();
export const shiftlight_store = writable<ShiftLight>(shiftlight_actor);
