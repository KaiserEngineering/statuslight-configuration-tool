<script lang="ts">
	import { gear, microchip } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
</script>

<div class="sidebar">
	<a href="/edit" class="sidebar-icon group">
		<Icon data={gear} style="color:white" />

		<span class="sidebar-tooltip group-hover:scale-100">Edit Config</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/update" class="sidebar-icon group">
		<Icon data={microchip} style="color:white" />

		<span class="sidebar-tooltip group-hover:scale-100">Update firmware version</span>
	</a>
</div>
