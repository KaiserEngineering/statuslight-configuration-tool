<script lang="ts">
  import { form_content } from "../lib/Store";
</script>

<div class="">
  <h2 class="text-black">RPM Shift Point Configuration:</h2>

  <div class="form-control max-w-xs">
    <label for="rpm-lower-limit">
      <span>Lower Limit:</span>
    </label>

    <input
      class="input input-sm w-20"
      bind:value={$form_content["RPM_LOWER_LIMIT"]}
      id="rpm-lower-limit"
      type="number"
    />
  </div>

  <!-- <div class="form-control max-w-xs">
    <label for="rpm-upper-limit">
      <span>Upper Limit:</span>
    </label>

    <input
      class="input input-sm w-20"
      bind:value={$form_content["RPM_UPPER_LIMIT"]}
      id="rpm-upper-limit"
      type="number"
    />
  </div> -->
</div>
