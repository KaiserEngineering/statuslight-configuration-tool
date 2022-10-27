<script lang="ts">
	import Header from '../components/Header.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Stylesheet from '../components/Stylesheet.svelte';
	import '../app.css';

	import { session } from '../lib/Store';

	// So we can use class:dark
	$: dark = $session.darkTheme;
</script>

<div class:dark>
	<div
		class="bg-gray-100 text-gray-800
	dark:bg-gray-900 dark:text-white h-screen"
	>
		<Loading />

		<SvelteToast />

		<Header />

		<slot />
	</div>
</div>

<Stylesheet />
