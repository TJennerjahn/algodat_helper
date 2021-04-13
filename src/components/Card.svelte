<script>
  import { slide } from "svelte/transition";
  let open = false;
</script>

<div class="bg-white m-4 rounded-lg">
  <i class="fas fa-chevron-right" />
  <h1
    on:click={() => {
      open = !open;
    }}
    class="text-4xl text-red-600 pl-4 py-2"
  >
    <slot name="title"><!-- optional fallback --></slot>
  </h1>

  {#if open}
    <div transition:slide={{ duration: 200 }} class="p-4">
      <slot class="mx-4 my-4" name="content"><!-- optional fallback --></slot>
    </div>
  {/if}
</div>
