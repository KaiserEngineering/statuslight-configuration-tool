<script lang="ts">
	import { get_serial_ports } from '../lib/API';
	import { shiftlight_store } from '../lib/Store';
	import { error } from '../lib/Toasts';
	import { load_current_config, type Port } from '$lib/ShiftLight';

	import Fa from 'sveltejs-fontawesome';
	import { faSun, faMoon, faRefresh } from '@fortawesome/free-solid-svg-icons';

	async function set_initial_config() {
		$shiftlight_store.loading = true;

		$shiftlight_store.configType = undefined;
		$shiftlight_store.config = {};

		load_current_config()
			.then((res) => {
				$shiftlight_store.loading = false;
				$shiftlight_store.config = res;
				$shiftlight_store.configType = res["configType"];
			})
			.catch((err) => {
				$shiftlight_store.loading = false;
				error(err);
			});
	}

	let ports: [Port] | [] = [];
	async function get_ports() {
		$shiftlight_store.loading = true;

		return await get_serial_ports()
			.then((ports_found) => {
				ports = ports_found;
				for (let port of ports_found) {
					if (port.port_info.includes('SHIFTLIGHT')) {
						$shiftlight_store.port = port;
						set_initial_config();
					}
				}
				$shiftlight_store.loading = false;
			})
			.catch((err) => {
				error(err);
				$shiftlight_store.loading = false;
			});
	}
	get_ports();

	let icon = faMoon;
	const toggleDark = () => {
		$shiftlight_store.darkTheme = !$shiftlight_store.darkTheme;
		if ($shiftlight_store.darkTheme) {
			icon = faSun;
		} else {
			icon = faMoon;
		}
	};

	// So we can use class:dark
	$: dark = $shiftlight_store.darkTheme;
</script>

<div class="flex m-4" class:dark>
	<div class="w-1/2">
		<select
			id="shiftlight-port"
			class="rounded-lg block w-full
				p-2 dark:text-slate-700"
			bind:value={$shiftlight_store.port}
			on:change={set_initial_config}
		>
			<option value="" disabled selected> Select UART Port</option>
			{#each ports as port}
				<option value={port}>{port.port_name} - {port.port_info}</option>
			{/each}
		</select>
	</div>

	<button class="m-2" on:click={get_ports}>
		<Fa icon={faRefresh} size="20" color={dark ? 'white' : 'black'} />
	</button>

	<div class="w-1/2 mr-4 flex justify-end content-center">
		<button on:click={toggleDark}>
			<Fa {icon} size="25" color={dark ? 'white' : 'black'} />
		</button>
	</div>
</div>
