<script>
  import CTChecker from "../components/CayleyTables/CTChecker.svelte";

  let menuItems = [
    {
      title: "CTChecker",
      active: true,
    },
  ];
</script>

<div class="flex">
  {#each menuItems as item}
    <button
      on:click={() => {
        for (var i = 0; i < menuItems.length; i++) {
          menuItems[i].active = false;
        }
        item.active = true;
      }}
      class="p-2 mx-1 underline {item.active === true
        ? `text-red-500 font-bold`
        : `text-gray-600`}"
    >
      {item.title}
    </button>
  {/each}
</div>

{#if menuItems[0].active === true}
  <CTChecker />
{/if}
