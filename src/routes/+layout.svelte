<script lang="ts">
	import Header from '../components/Header.svelte';
	import Loading from '../components/Loading.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Stylesheet from '../components/Stylesheet.svelte';
	import '../app.css';
</script>

<Stylesheet />

<Loading />

<SvelteToast />

<Header />

<slot />
