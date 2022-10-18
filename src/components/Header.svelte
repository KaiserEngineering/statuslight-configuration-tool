<script lang="ts">
	import { connect_to_serial_port, get_serial_ports } from '../lib/API';
	import { session, config } from '../lib/Store';
	import { error } from '../lib/Toasts';
	import { load_current_config, type Port } from '$lib/API';

	import Fa from 'sveltejs-fontawesome';
	import { faSun, faMoon, faRefresh } from '@fortawesome/free-solid-svg-icons';

	async function set_initial_config() {
		if (!$session.port) {
			error("No port selected");
			return;
		}

		$session.loading = true;

		$session.configType = undefined;
		$config = {};

		await connect_to_serial_port($session.port.port_name)
			.catch((err) => {
				$session.loading = false;
				error(err);
				return;
			});

		load_current_config()
			.then((res) => {
				$session.loading = false;
				$config = res;
				$session.configType = res["configType"];
			})
			.catch((err) => {
				$session.loading = false;
				error(err);
			});
	}

	let ports: [Port] | [] = [];
	async function get_ports() {
		$session.loading = true;

		return await get_serial_ports()
			.then((ports_found) => {
				ports = ports_found;
				for (let port of ports_found) {
					if (port.port_info.includes('SHIFTLIGHT')) {
						$session.port = port;
						set_initial_config();
					}
				}
				$session.loading = false;
			})
			.catch((err) => {
				error(err);
				$session.loading = false;
			});
	}
	get_ports();

	let icon = faMoon;
	const toggleDark = () => {
		$session.darkTheme = !$session.darkTheme;
		if ($session.darkTheme) {
			icon = faSun;
		} else {
			icon = faMoon;
		}
	};

	// So we can use class:dark
	$: dark = $session.darkTheme;
</script>

<div class="flex m-4" class:dark>
	<div class="w-1/2">
		<select
			id="shiftlight-port"
			class="rounded-lg block w-full
				p-2 dark:text-slate-700"
			bind:value={$session.port}
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
