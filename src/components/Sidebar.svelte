<script lang="ts">
	import { faHome, faGear, faMicrochip } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'sveltejs-fontawesome';
	import { session } from '../lib/Store';

	$: dark = $session.darkTheme;
</script>

<div class="fixed top-0 left-0 h-screen w-16 flex flex-col bg-white dark:bg-gray-800 shadow-lg">
	<a href="/" class="sidebar-icon group">
		<Fa icon={faHome} color={dark ? 'white' : 'black'} />

		<span class="sidebar-tooltip group-hover:scale-100">Home</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/edit" class="sidebar-icon group">
		<Fa icon={faGear} color={dark ? 'white' : 'black'} />

		<span class="sidebar-tooltip group-hover:scale-100">Edit configuration</span>
	</a>

	<hr class="sidebar-hr" />

	<a href="/update" class="sidebar-icon group">
		<Fa icon={faMicrochip} color={dark ? 'white' : 'black'} />

		<span class="sidebar-tooltip group-hover:scale-100">Update firmware version</span>
	</a>
</div>
