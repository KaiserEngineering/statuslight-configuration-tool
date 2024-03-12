<script lang="ts">
	import { getCurrentConfig, submitConfig } from '$lib/api';
	import { session, config, port, connected } from '$stores/session';
	import { success, error, info } from '$lib/toasts';
	import { RPMConfigs, BoostConfigs } from '$lib/config';

	$: $connected, $connected ? (configCopy = Object.assign({}, $config)) : '';

	export let fieldType: 'basics' | 'advanced';

	let configCopy = Object.assign({}, $config);

	const inputOptions = {
		basics: RPMConfigs,
		advanced: BoostConfigs
	}[configCopy.configType];

	async function update(): Promise<void> {
		if (!$connected) {
			error("You're not connected to your ShiftLight!");
			return;
		}

		$session.loading = true;

		// Only grab the fields that were changed from the current value
		let updatedFields: { [key: string]: any } = {};
		Object.keys(configCopy).forEach((key) => {
			if ($config[key] !== configCopy[key]) {
				updatedFields[key] = configCopy[key];
			}
		});

		if ($config.CONFIG !== configCopy.CONFIG) {
			updatedFields.CONFIG = configCopy.CONFIG;
		}

		if (Object.keys(updatedFields).length == 0) {
			info('Nothing to update');
			$session.loading = false;
		} else if ($port !== null) {
			submitConfig(updatedFields, $port.port_name)
				.then((results) => {
					if (results.error.length > 0) {
						let error_message: string = '';
						results.error.forEach((error) => {
							error_message += `${error}\n`;
						});
						error(error_message);
					} else {
						$config = Object.assign({}, configCopy);
						success('Config updated');
					}
				})
				.catch((err) => {
					error(err);
				})
				.finally(() => {
					$session.loading = false;
				});
			await getCurrentConfig()
				.then((res) => {
					$config = res;
				})
				.catch((err) => {
					error(err.message);
				});
		}
	}
</script>

<!-- Only show port selection until a port is chosen -->
<!-- Our form for out version the shiftlight is configured for -->
{#if configCopy && configCopy.ACT}
	<div class="m-2">
		<label for="CONFIG">
			<span>Config Type:</span>
		</label>

		<select
			class="input ke-input select select-sm"
			id="configType"
			bind:value={configCopy.CONFIG}
			required
		>
			{#each ['Boost', 'RPM'] as type}
				<option>{type}</option>
			{/each}
		</select>
	</div>

	<hr class="mb-2" />
	<form on:submit|preventDefault={update} class="w-3/4">
		<div class="col-span-full flex place-content-end">
			<button class="ke-button ke-input input">Update</button>
		</div>
	</form>
{:else}
	No configuration loaded from ShiftLight
{/if}
