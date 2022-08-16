<script lang="ts">
  import NavBar from "./components/NavBar.svelte";
  import { invoke } from "@tauri-apps/api";

  let ports = [];
  invoke("find_available_ports")
    // `invoke` returns a Promise
    .then((response: any) => {
      ports = response;
    });
</script>

<NavBar />

{#each ports as port}
  <div>{port.port_name}</div>
{/each}
