<script lang="ts">
	import { connectToSerialPort, getCurrentConfig, getSerialPorts, type Port } from '$lib/API';
	import { faRefresh, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { session, config } from '../lib/Store';
	import Fa from 'sveltejs-fontawesome';

	async function setInitialConfig() {
		if (!$session.port) {
			return;
		}

		$session.loading = true;

		$session.configType = undefined;
		$config = {};

		await connectToSerialPort($session.port.port_name).catch((err) => {
			$session.loading = false;
			error(err);
			return;
		});

		getCurrentConfig()
			.then((res) => {
				$config = res;
				$session.configType = res['configType'];
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => ($session.loading = false));
	}

	let ports: [Port] | [] = [];
	async function getPorts() {
		$session.loading = true;

		let open_conn = '';
		await getCurrentConfig()
			.then((res) => (open_conn = res))
			.catch((err) => console.error(err));

		return await getSerialPorts()
			.then((ports_found) => {
				ports = ports_found;

				for (let port of ports_found) {
					if (!open_conn && port.port_info.includes('SHIFTLIGHT')) {
						$session.port = port;
						set_initial_config();
					} else if (open_conn == port.port_name) {
						$session.port = port;
						set_initial_config();
					}
				}
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => ($session.loading = false));
	}
	getPorts();

	let darkModeIcon = $session.darkTheme ? faMoon : faSun;
	const toggleDark = () => {
		$session.darkTheme = !$session.darkTheme;
		if ($session.darkTheme) {
			darkModeIcon = faSun;
		} else {
			darkModeIcon = faMoon;
		}
	};

	$: dark = $session.darkTheme;
</script>

<div class="top-navigation">
	<div class="flex justify-start">
		<select
			id="shiftlight-port"
			class="rounded-lg block
				p-2 dark:text-slate-700 m-2"
			bind:value={$session.port}
			on:change={setInitialConfig}
		>
			<option value="" disabled selected> Select UART Port</option>
			{#each ports as port}
				<option value={port}>{port.port_name} - {port.port_info}</option>
			{/each}
		</select>

		<div class="sidebar-icon" on:click={getPorts} on:keydown={getPorts}>
			<Fa icon={faRefresh} color={dark ? 'white' : 'black'} />

			<span class="sidebar-tooltip group-hover:scale-100">Refresh available ports</span>
		</div>
	</div>

	<div class="fixed right-2">
		<div class="justify-items-end sidebar-icon group" on:click={toggleDark} on:keydown={toggleDark}>
			<Fa icon={darkModeIcon} color={dark ? 'white' : 'black'} />

			<span class="sidebar-tooltip group-hover:scale-100">Toggle dark mode</span>
		</div>
	</div>
</div>
