<script lang="ts">
  import { submit_config } from "../lib/API";
  import { session } from "../lib/Store";
  import { success, error } from "../lib/Toasts";
  import RPM from "./RPM.svelte";

  async function update() {
    $session.loading = true;
    submit_config()
      .then((response: any) => {
        for (const message of response) {
          if (message.Err) {
            error(message.Err.message);
          } else if (message.Ok) {
            success(message.Ok);
          } else {
            success(message);
          }
        }
      })
      .catch((err: any) => {
        error(err);
      })
      .finally(() => {
        $session.loading = false;
      });
  }
  let config_type = RPM;
</script>

<div class="p-4 w-full">
  <div>
    <svelte:component this={config_type} />
  </div>

  <div class="grid place-content-end">
    <button class="mt-2 btn btn-sm" on:click={update}>Update</button>
  </div>
</div>
