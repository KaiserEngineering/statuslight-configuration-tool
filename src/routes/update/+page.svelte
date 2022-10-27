<script lang="ts">
	async function updateFirmware() {
		console.log('Going to update firmware');
	}
</script>

<form>
	<div class="row">Firmware version: 1.x.x</div>
	<div class="row">Change log: ..... ..... .....</div>

	<button on:click={updateFirmware}>Update</button>
</form>
