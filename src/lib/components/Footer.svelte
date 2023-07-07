<script lang="ts">
	import { connected } from '$lib/stores';
	import { getVersion } from "@tauri-apps/plugin-app";
	import { type } from "@tauri-apps/plugin-os";
</script>

{#await getVersion() then version}
	v{version}
{/await}

{#await type() then os}
	<div
		data-bs-toggle="tooltip"
		data-bs-placement="top"
		title={os == 'Darwin' ? 'cmd+d to toggle connection' : 'ctrl+d to toggle connection'}
		class="ml-1 content-center"
	>
		{#if $connected}
			<p class="m-2 bg-green-600 text-slate-900 rounded p-1">Connected</p>
		{:else}
			<p class="m-2 bg-red-600 text-slate-900 rounded p-1">Disconnected</p>
		{/if}
	</div>
{:catch error}
	<div class="ml-1 content-center">
		{#if $connected}
			<p class="m-2 bg-green-600 text-slate-900 rounded p-1">Connected</p>
		{:else}
			<p class="m-2 bg-red-600 text-slate-900 rounded p-1">Disconnected</p>
		{/if}
	</div>
{/await}
