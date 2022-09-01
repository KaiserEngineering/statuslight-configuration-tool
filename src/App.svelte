<script lang="ts">
  import { invoke } from "@tauri-apps/api";

  let ports = [];
  let errors = [];
  let selected_port = "";

  invoke("find_available_ports")
    // `invoke` returns a Promise
    .then((response: any) => {
      ports = response;
    })
    .catch((error) => {
      errors = [error.Error];
    });

  async function SendMessage() {
    await invoke("send_message", {
      portName: selected_port,
      content: "SHIFT 9500",
    })
      .then((response: any) => {
        ports = response;
      })
      .catch((error) => {
        errors = [error.Error];
      });
  }
</script>

{#each errors as error}
  {JSON.stringify(error)}
{/each}

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
          bind:value={selected_port}
        >
          <option disabled selected>Select UART Port</option>
          {#each ports as port}
            <option>{port.port_name}</option>
          {/each}
        </select>
      </div>

      <button on:click={SendMessage}>Send Message</button>
    </div>
  </form>
</div>
