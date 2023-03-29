<script lang="ts">
	import Stylesheet from '../components/Stylesheet.svelte';
	import '../app.css';
	import Sidebar from '../components/Sidebar.svelte';
	import Topbar from '../components/Topbar.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '../components/Footer.svelte';
	import { port, session, config } from '$lib/stores';
	import { connectToSerialPort, getCurrentConfig } from '$lib/api';
	import { error, success } from '$lib/toasts';
	import { invoke } from '@tauri-apps/api';

	// Set the inital config store, this function is bound to
	// when our port store is set.
	async function setInitialConfig() {
		if (!$port) {
			return;
		}

		$session.loading = true;
		// Reset our config
		$config = {};

		connectToSerialPort($port.port_name)
			.then(() => {
				console.log('Calling get current config');
				getCurrentConfig()
					.then((res) => {
						$config = res;
						invoke('new_connection_event', {});
						success('Connection established');
					})
					.catch((err) => {
						error(err);
					})
					.finally(() => {
						$session.loading = false;
					});
				$session.loading = false;
			})
			.catch((err) => {
				$session.loading = false;
				error(err);
				$port = undefined;
			});
	}

	// Bind our initial config setting to the changing of our
	// port store.
	$: $port, setInitialConfig();

	$: dark = $session.darkTheme;
</script>

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
