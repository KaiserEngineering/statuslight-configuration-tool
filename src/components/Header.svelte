<script lang="ts">
	import { connect_to_serial_port, get_current_connection, get_serial_ports } from '../lib/API';
	import { session, config } from '../lib/Store';
	import { error } from '../lib/Toasts';
	import { load_current_config, type Port } from '$lib/API';
	import logo from '$lib/assets/logo.png';

	import Fa from 'sveltejs-fontawesome';
	import { faSun, faMoon, faRefresh } from '@fortawesome/free-solid-svg-icons';

	async function set_initial_config() {
		if (!$session.port) {
			return;
		}

		$session.loading = true;

		$session.configType = undefined;
		$config = {};

		await connect_to_serial_port($session.port.port_name).catch((err) => {
			$session.loading = false;
			error(err);
			return;
		});

		load_current_config()
			.then((res) => {
				$config = res;
				$session.configType = res['configType'];
			})
			.catch((err) => {
				error(err);
			})
			.finally(() => ($session.loading = false));
	}

	let icon = faMoon;
	const toggleDark = () => {
		$session.darkTheme = !$session.darkTheme;
		if ($session.darkTheme) {
			icon = faSun;
		} else {
			icon = faMoon;
		}
	};

	// So we can use class:dark
	$: dark = $session.darkTheme;
</script>

<nav class="bg-gray-200 dark:bg-gray-800 w-full">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-16 items-center justify-between">
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div class="flex flex-shrink-0 items-center">
					<img class="block h-8 w-auto lg:hidden" src={logo} alt="KaiserEngineering" />
				</div>

				<div class="flex m-2">
					<select
						id="shiftlight-port"
						class="rounded-lg block w-full
				p-2 dark:text-slate-700"
						bind:value={$session.port}
						on:change={set_initial_config}
					>
						<option value="" disabled selected> Select UART Port</option>
						{#each ports as port}
							<option value={port}>{port.port_name} - {port.port_info}</option>
						{/each}
					</select>

					<button class="m-2" on:click={get_ports}>
						<Fa icon={faRefresh} size="20" color={dark ? 'white' : 'black'} />
					</button>
				</div>

				<div class="flex items-center justify-center">
					<div class="flex space-x-2">
						<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
						<a
							href="/"
							class="bg-gray-300 dark:bg-gray-900 dark:text-white px-3 py-2 rounded-md text-sm font-medium"
							aria-current="page">Edit</a
						>

						<a
							href="/update"
							class="bg-gray-300 dark:bg-gray-900 dark:text-white px-3 py-2 rounded-md text-sm font-medium"
							aria-current="page">Version</a
						>
					</div>
				</div>
			</div>
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				<button on:click={toggleDark}>
					<Fa {icon} size="25" color={dark ? 'white' : 'black'} />
				</button>
			</div>
		</div>
	</div>
</nav>
