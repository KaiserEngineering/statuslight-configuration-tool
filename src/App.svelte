<script lang="ts">
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'

  import {get_serial_ports, write_serial} from './lib/API';
  import {shiftlight} from './lib/Store';

  let toast_options = {
    
  };

  async function get_ports() {
    return await get_serial_ports()
      .then((ports_found: any) => $shiftlight.ports = ports_found)
      .catch((error: any) => {
        toast.push(error);
      });
  }
  let ports_promise = get_ports();


  async function update() {
    await write_serial($shiftlight.selected_port.port_name, "SHIFT 6500")
      .then((response) => {
        toast.push(response);
      })
      .catch((error) => {
        toast.push(error, {
          theme: {
            '--toastBackground': '#F56565',
            '--toastBarBackground': '#C53030'
          }
        });
      });
  }
</script>

<SvelteToast {toast_options} />

{#await ports_promise}
    ...Finding serial ports on machine..
{:then}
  <div class="flex w-full items-center justify-center h-screen bg-white">
    <form
      on:submit|preventDefault
      class="shadow-md w-full mr-5 ml-5 rounded px-8 pt-6 pb-8"
    >

      <div class="w-full x-3 mb-6 md:mb-0">
        <label
          for="shiftlight-port"
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          data-tooltip="Select port ShiftLight is on"
        >
          Port:
        </label>
        <div class="relative">
          <select
            id="shiftlight-port"
            class="select max-w-xs"
            bind:value={$shiftlight.selected_port.port_name}
          >
            <option disabled selected>Select UART Port</option>
            {#each $shiftlight.ports as port}
              <option>{port.port_name}</option>
            {/each}
          </select>
        </div>

        <button on:click={update}>Send Message</button>
      </div>
    <!-- Only show port selection until a port is chosen -->
    {#if $shiftlight.selected_port}
    other content...
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
