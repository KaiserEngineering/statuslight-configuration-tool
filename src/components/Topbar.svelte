<script lang="ts">
	import { error } from '$lib/toasts';
	import { refresh, moonO, sunO } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
	import { session, port, ports } from '$stores/session';
	import { invoke } from '@tauri-apps/api/core';
	import { newConnection, type Port } from '$lib/api';
	import { dev } from '$app/environment';
	import * as Select from '$components/ui/select';

	// Grab a list of our available ports
	async function getPorts() {
		$session.loading = true;

		invoke('find_available_ports', {})
			.then((ports_found: [Port]) => {
				if (dev) {
					ports_found.push({
						port_name: 'TEST',
						product_name: 'Test Port'
					});
				}
				$ports = ports_found;
			})
			.catch((err: SerialError) => {
				error(err as unknown as string);
			})
			.finally(() => {
				$session.loading = false;
			});
	}
	// Always grab ports on mount
	getPorts().catch((err) => {
		$session.loading = false;
		error(err);
	});

	let darkModeIcon = $session.darkTheme ? moonO : sunO;
	const toggleDark = () => {
		$session.darkTheme = !$session.darkTheme;
		if ($session.darkTheme) {
			darkModeIcon = sunO;
		} else {
			darkModeIcon = moonO;
		}
	};

	let selectedPort = { value: $port.port_name };

	function portSelected() {
		$port = $ports.filter((p: Port) => p.port_name == selectedPort.value).pop();

		invoke('drop_connection', {}).catch((err) => {
			$session.loading = false;
			error(err);
		});

		newConnection().catch((err) => {
			$session.loading = false;
			error(err);
		});
	}
	$: selectedPort, portSelected();
</script>

<div class="top-navigation">
	<div class="flex">
		<Select.Root on:change={portSelected} bind:selected={selectedPort} name="shiftlight-port">
			<Select.Trigger
				id="shiftlight-port"
				class="rounded-lg input select
			p-2 m-2"
			>
				<Select.Value placeholder="Select UART Port" />
			</Select.Trigger>
			<Select.Content>
				{#each $ports as port}
					<Select.Item value={port.port_name}>{port.port_name} - {port.product_name}</Select.Item>
				{/each}
			</Select.Content>
			<input hidden bind:value={selectedPort} name={'shiftlight-port'} />
		</Select.Root>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="sidebar-icon group" on:click={getPorts} on:keydown={getPorts}>
			<Icon data={refresh} style="color:white" />

			<span class="sidebar-tooltip group-hover:scale-100">Refresh available ports</span>
		</div>
	</div>

	<div class="fixed right-2">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="sidebar-icon group" on:click={toggleDark} on:keydown={toggleDark}>
			<Icon data={darkModeIcon} style="color:white" />

			<span class="sidebar-tooltip-left group-hover:scale-100">Toggle dark mode</span>
		</div>
	</div>
</div>
