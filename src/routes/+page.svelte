<script lang="ts">
	import CurrentConfig from '../components/CurrentConfig.svelte';
	import { session } from '../lib/Store';

	// So we can use class:dark
	$: dark = $session.darkTheme;
</script>

<div class:dark>
	<div
		class="py-4
			h-screen
			transition
			bg-gray-100 text-gray-800
			dark:bg-gray-900 dark:text-white"
	>
		<!-- Only show port selection until a port is chosen -->
		{#if $session.configType}
			<div class="flex justify-center bg-white dark:bg-slate-600 ">
				<div
					on:submit|preventDefault
					class="shadow-inner shadow border w-full m-5 rounded px-8 pt-6 pb-8"
				>
					<CurrentConfig />
				</div>
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
