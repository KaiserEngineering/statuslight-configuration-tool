<script lang="ts">
	import Edit from '../components/Edit.svelte';
	import { session } from '../lib/Store';
</script>

<div
	class="py-4
			transition"
>
	<!-- Only show port selection until a port is chosen -->
	{#if $session.configType}
		<div class="flex justify-center bg-white dark:bg-slate-600 ">
			<div
				on:submit|preventDefault
				class="shadow-inner shadow border w-full m-5 rounded px-8 pt-6 pb-8"
			>
				<Edit />
			</div>
		</div>
	{/if}
</div>
