<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import Stylesheet from '../components/Stylesheet.svelte';
	import CurrentConfig from '../components/CurrentConfig.svelte';
	import Header from '../components/Header.svelte';
	import Loading from '../components/Loading.svelte';
	import { shiftlight, darkTheme } from '../lib/Store';
	import '../app.css';

	// So we can use class:dark
	$: dark = $darkTheme;
</script>

<Stylesheet />

<div class:dark>
	<div
		class="py-4
			h-screen
			transition
			bg-gray-100 text-gray-800
			dark:bg-gray-900 dark:text-white"
	>
		<Loading />

		<SvelteToast />

		<Header />

		{#if $shiftlight.port}
			<div class="flex justify-center bg-white">
				<form
					on:submit|preventDefault
					class="shadow-inner shadow border w-full m-5 rounded px-8 pt-6 pb-8"
				>
					<!-- Only show port selection until a port is chosen -->
					{#if $shiftlight.config_type}
						<CurrentConfig />
					{/if}
				</form>
			</div>
		{/if}
	</div>
</div>

<style>
	:root {
		--toastContainerTop: 1rem;
		--toastContainerRight: auto;
		--toastContainerBottom: auto;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
