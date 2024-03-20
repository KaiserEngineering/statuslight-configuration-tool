<script lang="ts">
	import { config, connected } from '$stores/session';
	import { getVersion } from '@tauri-apps/api/app';
	import * as Tooltip from '$components/ui/tooltip/index.js';
	import Loading from '$components/Loading.svelte';
</script>

<footer class="flex w-full justify-between items-center py-2">
	<div class="flex mx-auto justify-center items-center flex-row">
		{#if $config?.VER}
			<p class="text-center">v.{$config.VER}</p>
		{/if}

		<Tooltip.Root>
			<Tooltip.Trigger>
				<p
					class:bg-green-600={$connected}
					class:bg-red-600={!$connected}
					class="m-2 text-slate-900 rounded p-1 text-center"
				>
					{$connected ? 'Connected' : 'Disconnected'}
				</p></Tooltip.Trigger
			>
			<Tooltip.Content>
				<p>CTRL + D to connect or disconnect</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Loading />
	</div>

	<div class="text-end mr-2">
		{#await getVersion() then version}
			App: v{version}
		{/await}
	</div>
</footer>
