<script lang="ts">
	import Stylesheet from '$lib/components/Stylesheet.svelte';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '$lib/components/Footer.svelte';
	import { port, ports, session, config, connected } from '$lib/stores';
	import { newConnection, getCurrentConfig, type Port } from '$lib/api';
	import { error } from '$lib/toasts';
	import { invoke } from '@tauri-apps/api/tauri';
	import { getCurrent } from '@tauri-apps/plugin-window';

	const appWindow = getCurrent();

	async function handleConnectToggle(event: { code: string }) {
		// Mac is 'Key' and Windows is 'Control'
		if (event.code == 'KeyD' || event.code == 'ControlD') {
			if (!$port || !$port.port_name) {
				error('Select a port to connect!');
			} else if ($connected) {
				await invoke('plugin:serial|drop_connection', {}).catch((err: string) => {
					error(err);
					return;
				});
				$connected = false;
			} else {
				await newConnection();
			}
		}
	}

	async function ListenForConnectionEvents() {
		const unlistenDisconnectEvent = await appWindow.listen('DISCONNECTED', ({}) => {
			connected.set(false);
		});

		const unlistenConnectedEvent = await appWindow.listen('CONNECTED', async ({}) => {
			if (!$port || !$port.port_name) {
				return;
			}
			$session.loading = true;
			connected.set(true);

			await getCurrentConfig()
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
			async (event: { payload: { devices: [Port] } }) => {
				$ports = event.payload.devices;

				let port_still_here = [];
				if ($port && $port.port_name) {
					port_still_here = event.payload.devices.filter(
						(p: Port) => p.port_name == $port.port_name
					);
				}

				if (port_still_here.length > 0 && !$connected) {
					await newConnection();
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
			<Topbar />

			<div class="content-list">
				{#if $port && $port.port_name}
					<slot />
				{:else}
					<div class="flex grid h-full content-center">
						<div>Waiting on a connection...!</div>
					</div>
				{/if}
			</div>

			<div class="footer">
				<Footer />
			</div>
		</div>
	</div>
</div>

<Stylesheet />
