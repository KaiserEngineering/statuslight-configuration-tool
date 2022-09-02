<script lang="ts">
  import { SvelteToast, toast } from "@zerodevx/svelte-toast";

  import CurrentConfig from "./components/CurrentConfig.svelte";

  import { get_serial_ports } from "./lib/API";
  import { shiftlight } from "./lib/Store";

  let toast_options = {};

  async function get_ports() {
    return await get_serial_ports()
      .then((ports_found: any) => ($shiftlight.ports = ports_found))
      .catch((error: any) => {
        toast.push(error);
      });
  }
  let ports_promise = get_ports();
</script>

<SvelteToast {toast_options} />

<div class="m-4">
  <div class="relative">
    <select
      id="shiftlight-port"
      class="select bg-white max-w-xs"
      bind:value={$shiftlight.selected_port.port_name}
    >
      <option disabled selected>Select UART Port</option>
      {#each $shiftlight.ports as port}
        <option>{port.port_name}</option>
      {/each}
    </select>
  </div>
</div>

{#await ports_promise}
  ...Finding serial ports on machine..
{:then}
  <div class="flex justify-center bg-white">
    <form
      on:submit|preventDefault
      class="shadow-inner shadow border w-full m-5 rounded px-8 pt-6 pb-8"
    >
      <!-- Only show port selection until a port is chosen -->
      {#if $shiftlight.selected_port}
        <CurrentConfig />
      {/if}
    </form>
  </div>
{:catch}
  <p>Couldn't open serial ports on machine :/</p>
{/await}

<style>
  :root {
    --toastContainerTop: 1rem;
    --toastContainerRight: auto;
    --toastContainerBottom: auto;
    --toastContainerLeft: calc(50vw - 8rem);
  }
</style>
