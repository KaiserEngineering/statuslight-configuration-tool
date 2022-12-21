<script lang="ts">
	import { home, gear, microchip, exclamation } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';
</script>

<div class="sidebar">
	<a href="/" class="sidebar-icon group">
		<Icon data={home} style="color:white"/>

		<span class="sidebar-tooltip group-hover:scale-100">Home</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/edit/basics" class="sidebar-icon group">
		<Icon data={gear} style="color:white"/>

		<span class="sidebar-tooltip group-hover:scale-100">Basic Config</span>
	</a>

	<a href="/edit/advanced" class="sidebar-icon group">
		<Icon data={exclamation} style="color:white"/>

		<span class="sidebar-tooltip group-hover:scale-100">Advanced Config</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/update" class="sidebar-icon group">
		<Icon data={microchip} style="color:white"/>

		<span class="sidebar-tooltip group-hover:scale-100">Update firmware version</span>
	</a>
</div>
