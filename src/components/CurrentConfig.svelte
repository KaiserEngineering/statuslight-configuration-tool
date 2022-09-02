<script lang="ts">
  import { submit_config } from "../lib/API";
  import { session } from "../lib/Store";
  import { toast } from "@zerodevx/svelte-toast";
  import RPM from "./RPM.svelte";

  async function update() {
    $session.loading =true;
    submit_config()
      .then((response: any) => {
        for (const message of response) {
          if (message.Err) {
            toast.push(message.Err.message, {
              theme: {
                "--toastBackground": "#F56565",
                "--toastBarBackground": "#C53030",
              },
            });
          } else if (message.Ok) {
            toast.push(message.Ok, {
              theme: {
                "--toastBackground": "#48BB78",
                "--toastBarBackground": "#2F855A",
              },
            });
          } else {
            toast.push(message, {
              theme: {
                "--toastBackground": "#F56565",
                "--toastBarBackground": "#C53030",
              },
            });
          }
        }
      })
      .catch((error: any) => {
        toast.push(error, {
          theme: {
            "--toastBackground": "#F56565",
            "--toastBarBackground": "#C53030",
          },
        });
      })
      .finally(() => {
        $session.loading = false;
      })
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
