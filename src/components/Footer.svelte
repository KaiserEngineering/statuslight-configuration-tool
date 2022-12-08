<script lang="ts">
	import { getVersion } from '@tauri-apps/api/app';

	let versionPromise = getVersion();
</script>

{#await versionPromise then version}
	v{version}
{/await}
