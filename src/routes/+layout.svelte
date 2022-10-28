<script lang="ts">
	import Sidebar from '../components/Sidebar.svelte';
	import Topbar from '../components/Topbar.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Stylesheet from '../components/Stylesheet.svelte';
	import '../app.css';

	import { session } from '../lib/Store';

	// So we can use class:dark
	$: dark = $session.darkTheme;
</script>

<div class:dark>
	<div class="dark:bg-gray-900 h-screen flex dark:text-white">
		<Loading />

		<SvelteToast />

		<Sidebar />

		<div class="content-container">
			<Topbar />

			<div class="content-list">
				<slot />
			</div>
		</div>
	</div>
</div>

<Stylesheet />
