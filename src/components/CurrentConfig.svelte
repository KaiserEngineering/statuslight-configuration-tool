<script lang="ts">
  import { submit_config } from "../lib/API";
  import RPM from "./RPM.svelte";

  import { toast } from "@zerodevx/svelte-toast";

  async function update() {
    await submit_config()
      .then((response: any) => {
        for ( const error of response.error ) {
          toast.push(error, {
            theme: {
              "--toastBackground": "#F56565",
              "--toastBarBackground": "#C53030",
            },
          });
        }

        for ( const success of response.success ) {
          toast.push(success, {
            theme: {
              '--toastBackground': '#48BB78',
              '--toastBarBackground': '#2F855A'
            },
          });
        }
      })
      .catch((error: any) => {
        toast.push(error, {
          theme: {
            "--toastBackground": "#F56565",
            "--toastBarBackground": "#C53030",
          },
        });
      });
  }
  let config_type = RPM;
</script>

<div class="p-4 w-full">
  <div>
    <svelte:component
      this={config_type}
    />
  </div>

  <div class="grid place-content-end">
    <button class="mt-2 btn btn-sm" on:click={update}>Update</button>
  </div>
</div>
