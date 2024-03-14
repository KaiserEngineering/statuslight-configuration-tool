<script lang="ts">
	import { connected } from '$stores/session';
	import { getVersion } from '@tauri-apps/api/app';
	import Loading from '$components/Loading.svelte';
</script>

{#await getVersion() then version}
	v{version}
{/await}

<div
	data-bs-toggle="tooltip"
	data-bs-placement="top"
	title={'ctrl+d to toggle connection'}
	class="ml-1 content-center flex flex-row items-center justify-center flex-g"
>
	{#if $connected}
		<p class="m-2 bg-green-600 text-slate-900 rounded p-1">Connected</p>
	{:else}
		<p class="m-2 bg-red-600 text-slate-900 rounded p-1">Disconnected</p>
	{/if}

	<Loading />
</div>
