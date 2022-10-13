<script lang="ts">
	import { get_serial_ports } from '../lib/API';
	import { session, shiftlight, darkTheme } from '../lib/Store';

	import Fa from 'sveltejs-fontawesome';
	import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

	import { error } from '../lib/Toasts';

	async function set_initial_config() {
		$session.loading = true;
		$shiftlight
			.load_current_config()
			.then(() => ($session.loading = false))
			.catch((err) => {
				$session.loading = false;
				error(err);
			});
	}

	let ports = [];
	async function get_ports() {
		$session.loading = true;
		return await get_serial_ports()
			.then((ports_found) => {
				ports = ports_found;
				for (let port of ports_found) {
					if (port.port_info.includes('SHIFTLIGHT')) {
						$shiftlight.port = port;
						set_initial_config();
					}
				}
				$session.loading = false;
			})
			.catch((err) => {
				error(err);
				$session.loading = false;
			});
	}
	get_ports();

  let icon = faMoon;
	const toggleDark = () => {
    $darkTheme = !$darkTheme;
    if ( $darkTheme ) {
      icon = faSun;
    }
    else {
      icon = faMoon;
    }
  };

	// So we can use class:dark
	$: dark = $darkTheme;
</script>

<div class="flex m-4" class:dark>
	<div class="w-1/2">
		<select
			id="shiftlight-port"
			class="rounded-lg block w-full
				p-2 dark:text-slate-700"
			bind:value={$shiftlight.port}
			on:change={set_initial_config}
		>
			<option value="" disabled selected> Select UART Port</option>
			{#each ports as port}
				<option value={port}>{port.port_name} - {port.port_info}</option>
			{/each}
		</select>
	</div>

	<div class="w-1/2 mr-4 flex justify-end content-center">
		<button on:click={toggleDark}>
			<Fa icon={icon} size="25" color="{$darkTheme ? "white": "black"}" />
		</button>
	</div>
</div>
