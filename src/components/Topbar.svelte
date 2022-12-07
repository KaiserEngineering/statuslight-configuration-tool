<script lang="ts">
	import { error, success } from '$lib/Toasts';

	import {
		connectToSerialPort,
		getCurrentConfig,
		getCurrentConnection,
		getSerialPorts,
		type Port
	} from '$lib/API';
	import { faRefresh, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { session, config, port, newConnection } from '../lib/Store';
	import Fa from 'sveltejs-fontawesome';

	async function setInitialConfig() {
		if (!$port) {
			return;
		}

		$session.loading = true;

		$config = {};

		await connectToSerialPort($port.port_name)
			.then(() => {
				getCurrentConfig()
					.then((res) => {
						$config = res;
						$newConnection = true;
						success('Connection established');
					})
					.catch((err) => {
						error(err);
					})
					.finally(() => {
						$session.loading = false;
					});
			})
			.catch((err) => {
				$session.loading = false;
				error(err);
				$port = undefined;
				return;
			});
	}

	let ports: [Port] | [] = [];
	async function getPorts() {
		$session.loading = true;

		let open_conn = '';
		getCurrentConnection()
			.then((res: any) => {
				open_conn = res;
			})
			.catch((_err) => {})
			.finally(() => {
				return getSerialPorts()
					.then((ports_found: any) => {
						ports = ports_found;

						for (let foundPort of ports_found) {
							if (!open_conn && foundPort.port_info.includes('SHIFTLIGHT')) {
								$port = foundPort;
							} else if (open_conn == foundPort.port_name) {
								$port = foundPort;
								break;
							}
						}
						setInitialConfig().catch((err) => console.error(err));
					})
					.catch((err) => {
						error(err);
					})
					.finally(() => {
						$session.loading = false;
					});
			});
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
			class="rounded-lg block input select
				p-2 m-2"
			bind:value={$port}
			on:change={setInitialConfig}
		>
			<option value="" disabled selected> Select UART Port</option>
			{#each ports as port}
				<option value={port}>{port.port_name} - {port.port_info}</option>
			{/each}
		</select>

		<div class="sidebar-icon group" on:click={getPorts} on:keydown={getPorts}>
			<Fa icon={faRefresh} color="white" />

			<span class="sidebar-tooltip group-hover:scale-100">Refresh available ports</span>
		</div>
	</div>

	<div class="fixed right-2">
		<div class="sidebar-icon group" on:click={toggleDark} on:keydown={toggleDark}>
			<Fa icon={darkModeIcon} color="white" />

			<span class="sidebar-tooltip-left group-hover:scale-100">Toggle dark mode</span>
		</div>
	</div>
</div>
