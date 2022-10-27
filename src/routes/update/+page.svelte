<script lang="ts">
	import { session } from '$lib/Store';

	// So we can use class:dark
	$: dark = $session.darkTheme;
</script>

<div class:dark>
	<div
		class="py-4
			h-screen
			transition
			bg-gray-100 text-gray-800
			dark:bg-gray-900 dark:text-white"
	>
		I am here
	</div>
</div>
