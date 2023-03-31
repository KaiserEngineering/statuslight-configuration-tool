<script lang="ts">
	import { connected } from '$lib/stores';
	import { getVersion } from '@tauri-apps/api/app';

	let versionPromise = getVersion();
</script>

{#await versionPromise then version}
	v{version}
{/await}

{#if $connected}
	<p class="m-2 bg-green-600 rounded p-1">Connected</p>
{:else}
	<p class="m-2 bg-red-600 rounded p-1">Disconnected</p>
{/if}
