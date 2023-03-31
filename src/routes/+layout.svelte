<script lang="ts">
	import Stylesheet from '../components/Stylesheet.svelte';
	import '../app.css';
	import Sidebar from '../components/Sidebar.svelte';
	import Topbar from '../components/Topbar.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '../components/Footer.svelte';
	import { port, ports, session, config, connected } from '$lib/stores';
	import { connectToSerialPort, getCurrentConfig, type Port } from '$lib/api';
	import { error } from '$lib/toasts';
	import { invoke } from '@tauri-apps/api';
	import { appWindow } from '@tauri-apps/api/window';

	async function newConnection() {
		invoke('plugin:serial|drop_connection', {}).catch((err) => {
			error(err.message);
			return;
		});

		connectToSerialPort($port.port_name).catch((err) => {
			error(err.message);
		});
	}

	function handleConnectToggle(event: { code: string }) {
		// Mac is 'Key' and Windows is 'Control'
		if (event.code == 'KeyD' || event.code == 'ControlD') {
			if (!$port.port_name) {
				error('Select a port to connect!');
			} else if ($connected) {
				$connected = false;
			} else {
				newConnection();
			}
		}
	}

	async function ListenForConnectionEvents() {
		const unlistenDisconnectEvent = await appWindow.listen('DISCONNECTED', ({}) => {
			connected.set(false);
		});

		const unlistenConnectedEvent = await appWindow.listen('CONNECTED', ({}) => {
			if (!$port || !$port.port_name) {
				return;
			}
			$session.loading = true;
			connected.set(true);

			getCurrentConfig()
				.then((res) => {
					$config = res;
				})
				.catch((err) => {
					error(err.message);
				});
			$session.loading = false;
		});

		const DEVICE_LIST_UPDATED = await appWindow.listen(
			'DEVICE_LIST_UPDATED',
			(event: { payload: { devices: [Port] } }) => {
				$ports = event.payload.devices;

				let port_still_here = [];
				if ($port && $port.port_name) {
					port_still_here = event.payload.devices.filter((p: Port) => {
						p.port_name == $port.port_name;
					});
				}

				if (port_still_here.length > 0 && !$connected) {
					newConnection();
				} else if (port_still_here.length == 0 && $connected) {
					$connected = false;
				}
			}
		);
	}
	ListenForConnectionEvents();

	$: $port, newConnection;

	$: dark = $session.darkTheme;
</script>

<svelte:window on:keydown={handleConnectToggle} />

<div class:dark>
	<div class="h-screen flex">
		<Loading />

		<SvelteToast />

		<Sidebar />

		<div class="content-container">
			<Topbar {newConnection} />

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
