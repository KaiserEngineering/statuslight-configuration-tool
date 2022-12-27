<script lang="ts">
	import Sidebar from '../components/Sidebar.svelte';
	import Topbar from '../components/Topbar.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Stylesheet from '../components/Stylesheet.svelte';
	import { session } from '../lib/Store';
	import '../app.css';
	import Footer from '../components/Footer.svelte';

	// So we can use class:dark
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
