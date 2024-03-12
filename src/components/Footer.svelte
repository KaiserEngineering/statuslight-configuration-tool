<script lang="ts">
	import { connected } from '$stores/session';
	import { getVersion } from '@tauri-apps/api/app';
</script>

{#await getVersion() then version}
	v{version}
{/await}

<div
	data-bs-toggle="tooltip"
	data-bs-placement="top"
	title={'cmd+d (mac) or ctrl+d (windows) to toggle connection'}
	class="ml-1 content-center"
>
	{#if $connected}
		<p class="m-2 bg-green-600 text-slate-900 rounded p-1">Connected</p>
	{:else}
		<p class="m-2 bg-red-600 text-slate-900 rounded p-1">Disconnected</p>
	{/if}
</div>
