<script lang="ts">
  import { submit_config } from "../lib/API";
  import { session, shiftlight } from "../lib/Store";
  import { success, error } from "../lib/Toasts";
  import { ShiftLightConfigs } from "../lib/Config";
  import { form_content } from "../lib/Store";

  async function update() {
    $session.loading = true;
    submit_config()
      .then((response: any) => {
        let errors = [];
        for (const message of response) {
          if (message.Err) {
            errors.push(message.Err.message);
          }
        }
        if (errors.length > 0 ) {
          error(JSON.stringify(errors));
        }
        else {
          success("Config updated");
        }
      })
      .catch((err: any) => {
        error(err);
      })
      .finally(() => {
        $session.loading = false;
      });
  }

  let variant = $shiftlight.variant;
  $: input_options = ShiftLightConfigs[variant] || {};
</script>

<div class="p-4 w-full">
  <div class="form-control max-w-xs">
    <label for="variant">
      <span>ShiftLight Variant:</span>
    </label>

    <select
      class="select select-sm"
      id="variant"
      bind:value={variant}
    >
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
      {#if typeof variant[input] == "string"}
        <input
          bind:value={$form_content[input]}
          class="input input-sm"
          id={input}
        />
      {:else}
        <select
          class="select select-sm"
          id={input}
          bind:value={$form_content[input]}
        >
          {#each Object.keys(input_options[input]) as option}
            <option>{option}</option>
          {/each}
        </select>
      {/if}
    {/each}
  </div>

  <div class="grid place-content-end">
    <button class="mt-2 btn btn-sm" on:click={update}>Update</button>
  </div>
</div>
