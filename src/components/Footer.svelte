<script lang="ts">
	import { connected } from '$lib/stores';
	import { getVersion } from '@tauri-apps/api/app';
	import { type } from '@tauri-apps/api/os';
	let versionPromise = getVersion();
	let osTypePromise = type();
</script>

{#await versionPromise then version}
	v{version}
{/await}
{#await osTypePromise then os}
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
{/await}
