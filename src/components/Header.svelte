<script lang="ts">
	import { get_serial_ports } from '../lib/API';
	import { shiftlight_store } from '../lib/Store';

	import Fa from 'sveltejs-fontawesome';
	import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

	import { error } from '../lib/Toasts';

	async function set_initial_config() {
		$shiftlight_store.ui_data.loading = true;

		$shiftlight_store.ui_data.config_type = undefined;
		$shiftlight_store.ui_data.config = {};

		$shiftlight_store.load_current_config()
			.then((res) => {
				$shiftlight_store.ui_data.loading = false;
				$shiftlight_store.ui_data = res;
			})
			.catch((err) => {
				$shiftlight_store.ui_data.loading = false;
				error(err);
			});
	}

	let ports = [];
	async function get_ports() {
		$shiftlight_store.ui_data.loading = true;

		return await get_serial_ports()
			.then((ports_found) => {
				ports = ports_found;
				for (let port of ports_found) {
					if (port.port_info.includes('SHIFTLIGHT')) {
						$shiftlight_store.ui_data.port = port;
						set_initial_config();
					}
				}
				$shiftlight_store.ui_data.loading = false;
			})
			.catch((err) => {
				error(err);
				$shiftlight_store.ui_data.loading = false;
			});
	}
	get_ports();

	let icon = faMoon;
	const toggleDark = () => {
		$shiftlight_store.ui_data.darkTheme = !$shiftlight_store.ui_data.darkTheme;
		if ($shiftlight_store.ui_data.darkTheme) {
			icon = faSun;
		} else {
			icon = faMoon;
		}
	};

	// So we can use class:dark
	$: dark = $shiftlight_store.ui_data.darkTheme;
</script>

<div class="flex m-4" class:dark>
	<div class="w-1/2">
		<select
			id="shiftlight-port"
			class="rounded-lg block w-full
				p-2 dark:text-slate-700"
			bind:value={$shiftlight_store.ui_data.port}
			on:change={set_initial_config}
		>
			<option value="" disabled selected> Select UART Port</option>
			{#each ports as port}
				<option value={port}>{port.port_name} - {port.port_info}</option>
			{/each}
		</select>
	</div>

	<div class="w-1/2 mr-4 flex justify-end content-center">
		<button on:click={toggleDark}>
			<Fa {icon} size="25" color={dark ? 'white' : 'black'} />
		</button>
	</div>
</div>
