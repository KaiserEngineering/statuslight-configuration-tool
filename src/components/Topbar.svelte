<script lang="ts">
	import { error, info } from '$lib/toasts';
	import { getSerialPorts } from '$lib/api';
	import { refresh, moonO, sunO } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
	import { session, port, ports } from '$lib/stores';

	// Grab a list of our available ports
	async function getPorts() {
		$session.loading = true;

		getSerialPorts()
			.then((ports_found: any) => {
				$ports = ports_found;
			})
			.catch((err) => {
				error(err);
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
</script>

<div class="top-navigation">
	<div class="flex">
		<select
			id="shiftlight-port"
			class="rounded-lg input select
				p-2 m-2"
			bind:value={$port.port_name}
		>
			<option value="" disabled selected> Select UART Port</option>
			{#each $ports as port}
				<option value={port.port_name}>{port.port_name} - {port.port_info}</option>
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
