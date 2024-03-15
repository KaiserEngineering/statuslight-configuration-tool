<script lang="ts">
	import Stylesheet from '$components/Stylesheet.svelte';
	import '../app.css';
	import Sidebar from '$components/Sidebar.svelte';
	import Topbar from '$components/Topbar.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '$components/Footer.svelte';
	import { port, ports, session, config, connected } from '$stores/session';
	import { newConnection, getCurrentConfig, type Port } from '$lib/api';
	import { error } from '$lib/toasts';
	import { invoke } from '@tauri-apps/api/core';
	import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

	const appWindow = WebviewWindow.getCurrent();

	async function handleConnectToggle(event: KeyboardEvent) {
		try {
			if (event.code == 'KeyD' && event.ctrlKey) {
				if (!$port || !$port.port_name) {
					throw new Error('Select a port to connect!');
				} else if ($connected) {
					invoke('drop_connection', {}).catch((err) => {
						$session.loading = false;
						error(err);
					});
				} else {
					newConnection().catch((err) => {
						$session.loading = false;
						error(err);
					});
				}
			}
		} catch (err) {
			error(err.toString());
		}
	}

	function ListenForConnectionEvents() {
		appWindow.listen('DISCONNECTED', ({}) => {
			connected.set(false);
		});

		appWindow.listen('CONNECTED', async ({}) => {
			try {
				if (!$port || !$port.port_name) {
					return;
				}
				$session.loading = true;
				connected.set(true);

				const res = await getCurrentConfig();
				$config = res;
			} catch (err) {
				$session.loading = false;
				error(err);
			} finally {
				$session.loading = false;
			}
		});

		appWindow.listen('DEVICE_LIST_UPDATED', async (event: { payload: { devices: Port[] } }) => {
			try {
				$ports = event.payload.devices;

				if ($port && $port.port_name) {
					const portStillHere = event.payload.devices.find(
						(p: Port) => p.port_name === $port.port_name
					);
					if (!portStillHere && $connected) {
						connected.set(false);
					}

					if (portStillHere && !$connected) {
						await newConnection();
					}
				}
			} catch (err) {
				error(err);
				$session.loading = false;
			}
		});
	}

	ListenForConnectionEvents();

	$: $port, newConnection;
	$: dark = $session.darkTheme;
</script>

<svelte:window on:keydown={handleConnectToggle} />

<div class:dark>
	<div class="h-screen flex">
		<SvelteToast />

		<Sidebar />

		<div class="content-container">
			<Topbar />

			<div class="content-list">
				<slot />
			</div>

			<div class="footer">
				<Footer />
			</div>
		</div>
	</div>
</div>

<Stylesheet />
