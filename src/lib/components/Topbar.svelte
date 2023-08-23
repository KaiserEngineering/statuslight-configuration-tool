<script lang="ts">
	import { error } from '$lib/toasts';
	import { refresh, moonO, sunO } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
	import { session, port, ports } from '$lib/stores';
	import { invoke } from '@tauri-apps/api';
	import { newConnection } from '$lib/api';

	// Grab a list of our available ports
	async function getPorts() {
		$session.loading = true;

		invoke('plugin:serial|find_available_ports', {})
			.then((ports_found: any) => {
				$ports = ports_found;
			})
			.catch((err: SerialError) => {
				error('HERE' + err);
			})
			.finally(() => {
				$session.loading = false;
			});
	}
	// Always grab ports on mount
	getPorts();

	let darkModeIcon = $session.darkTheme ? moonO : sunO;
	const toggleDark = () => {
		$session.darkTheme = !$session.darkTheme;
		if ($session.darkTheme) {
			darkModeIcon = sunO;
		} else {
			darkModeIcon = moonO;
		}
	};

	let selectedPort = $port.port_name;

	function portSelected() {
		$port = $ports.filter((p) => p.port_name == selectedPort).pop();
		newConnection().catch((err) => {
			$session.loading = false;
			error(err);
		});
	}
</script>

<div class="top-navigation">
	<div class="flex">
		<select
			id="shiftlight-port"
			class="rounded-lg input select
				p-2 m-2"
			bind:value={selectedPort}
			on:change={portSelected}
		>
			<option value=""> Select UART Port</option>
			{#each $ports as port}
				<option value={port.port_name}>{port.port_name} - {port.product_name}</option>
			{/each}
		</select>

		<div class="sidebar-icon group" on:click={getPorts} on:keydown={getPorts}>
			<Icon data={refresh} style="color:white" />

			<span class="sidebar-tooltip group-hover:scale-100">Refresh available ports</span>
		</div>
	</div>

	<div class="fixed right-2">
		<div class="sidebar-icon group" on:click={toggleDark} on:keydown={toggleDark}>
			<Icon data={darkModeIcon} style="color:white" />

			<span class="sidebar-tooltip-left group-hover:scale-100">Toggle dark mode</span>
		</div>
	</div>
</div>
