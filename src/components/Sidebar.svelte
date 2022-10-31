<script lang="ts">
	import { faHome, faGear, faMicrochip } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'sveltejs-fontawesome';
</script>

<div class="sidebar">
	<a href="/" class="sidebar-icon group">
		<Fa icon={faHome} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Home</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/edit" class="sidebar-icon group">
		<Fa icon={faGear} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Edit configuration</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/update" class="sidebar-icon group">
		<Fa secondaryColor="blue" icon={faMicrochip} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Update firmware version</span>
	</a>
</div>
