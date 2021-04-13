<script>
  import BinarySearch from "../components/SearchAlgorithms/BinarySearch.svelte";
  import JumpSearch from "../components/SearchAlgorithms/JumpSearch.svelte";
  import InterpolationSearch from "../components/SearchAlgorithms/InterpolationSearch.svelte";

  let menuItems = [
    {
      title: "Binary Search",
      active: true,
    },
    {
      title: "Sprungsuche",
      active: false,
    },
    {
      title: "Interpolationssuche",
      active: false,
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
  <BinarySearch />
{/if}

{#if menuItems[1].active === true}
  <JumpSearch />
{/if}

{#if menuItems[2].active === true}
  <InterpolationSearch />
{/if}
