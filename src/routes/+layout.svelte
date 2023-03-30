<script lang="ts">
	import Stylesheet from '../components/Stylesheet.svelte';
	import '../app.css';
	import Sidebar from '../components/Sidebar.svelte';
	import Topbar from '../components/Topbar.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '../components/Footer.svelte';
	import { port, session, config, connected } from '$lib/stores';
	import { connectToSerialPort, getCurrentConfig } from '$lib/api';
	import { error } from '$lib/toasts';
	import { invoke } from '@tauri-apps/api';

	function handleConnectToggle(event: { code: string }) {
		// Mac is 'Key' and Windows is 'Control'
		if (event.code == 'KeyD' || event.code == 'ControlD') {
			if ($connected) {
				invoke('plugin:serial|drop_connection', {}).catch((err) => {
					error(err);
				});
			} else {
				if (!$port.port_name) {
					error('Select a port to connect!');
				} else {
					connectToSerialPort($port.port_name).catch((err) => error(err));
				}
			}
		}
	}

	// Set the inital config store, this function is bound to
	// when our port store is set.
	async function setInitialConfig() {
		if (!$port || !$port.port_name) {
			return;
		}

		$session.loading = true;
		// Reset our config
		$config = {};

		getCurrentConfig()
			.then((res) => {
				$config = res;
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => {
				$session.loading = false;
			});
		$session.loading = false;
	}

	// Bind our initial config setting to the changing of our
	// port store.
	$: $port, setInitialConfig();

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
				<slot />
			</div>

			<div class="footer">
				<Footer />
			</div>
		</div>
	</div>
</div>

<Stylesheet />
