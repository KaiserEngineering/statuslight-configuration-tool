<script lang="ts">
  import { form_content } from "../lib/Store";
</script>

<div class="">

  <div class="form-control max-w-xs">
    <label for="rpm-shift">
      <span>RPM Shift Point:</span>
    </label>

    <input
      class="input input-sm w-20"
      bind:value={$form_content["SHIFT"]}
      id="rpm-shift"
      type="number"
    />
  </div>

</div>
