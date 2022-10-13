<script lang="ts">
  import { submit_config } from "../lib/API";
  import { session, shiftlight } from "../lib/Store";
  import { success, error } from "../lib/Toasts";
  import { ShiftLightConfigs } from "../lib/Config";

  let config = $shiftlight.loaded_config || {};
  async function update(): Promise<void> {
    $session.loading = true;
    submit_config(config)
      .then((results) => {
        if (results.error.length > 0) {
          error(JSON.stringify(results.error));
        } else {
          success("Config updated");
        }
      })
      .catch((err) => {
        error(err);
      })
      .finally(() => {
        $session.loading = false;
      });
  }

  let config_type = $shiftlight.config_type || "";
  $: input_options = ShiftLightConfigs[config_type] || {};
</script>

<div class="p-4 w-full">
  <div class="form-control max-w-xs">
    <label for="config_type">
      <span>Config Type:</span>
    </label>

    <select class="select select-sm" id="config_type" bind:value={config_type}>
      {#each Object.keys(ShiftLightConfigs) as type}
        <option>{type}</option>
      {/each}
    </select>
  </div>

  <!-- Our form for out version the shiftlight is configured for -->
  <div class="form-control max-w-xs">
    {#each Object.keys(input_options) as input}
      <label for={input}>
        <span>{input}:</span>
      </label>
      {#if typeof input_options[input]["type"] == "string"}
        <input bind:value={config[input_options[input]["code"]]} class="input input-sm" id={input_options[input]["code"]} />
      {:else}
        <select class="select select-sm" id={input_options[input]["code"]} bind:value={config[input_options[input]["code"]]}>
          {#each input_options[input]["type"] as option}
            <option value="{option["value"]}">{option["label"]}</option>
          {/each}
        </select>
      {/if}
    {/each}
  </div>

  <div class="grid place-content-end">
    <button class="mt-2 btn btn-sm" on:click={update}>Update</button>
  </div>
</div>
