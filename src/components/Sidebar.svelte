<script lang="ts">
	import { faHome, faGear, faMicrochip, faExclamation } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'sveltejs-fontawesome';
</script>

<div class="sidebar">
	<a href="/" class="sidebar-icon group">
		<Fa icon={faHome} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Home</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/edit/basics" class="sidebar-icon group">
		<Fa icon={faGear} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Basic Config</span>
	</a>

	<a href="/edit/advanced" class="sidebar-icon group">
		<Fa icon={faExclamation} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Advanced Config</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/update" class="sidebar-icon group">
		<Fa secondaryColor="blue" icon={faMicrochip} color="white" />

		<span class="sidebar-tooltip group-hover:scale-100">Update firmware version</span>
	</a>
</div>
