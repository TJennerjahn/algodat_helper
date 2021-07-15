<script>
  import MatrixMultiplication from "../components/DynamicProgramming/MatrixMultiplication.svelte";
  import DynamicTSP from "../components/DynamicProgramming/DynamicTSP.svelte";
  import UnboundedKnapsack from "../components/DynamicProgramming/UnboundedKnapsack.svelte";
  import EditDistance from "../components/DynamicProgramming/EditDistance.svelte";
  import Hirschberg from '../components/DynamicProgramming/Hirschberg.svelte';

  let menuItems = [
    {
      title: "Matrix Multiplikation",
      active: false,
    },
    {
      title: "Dynamic TSP",
      active: false,
    },
    {
      title: "Unbounded Knapsack",
      active: false,
    },
    {
      title: "Edit Distanz",
      active: false,
    },
    {
      title: "Hirschberg",
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
  <MatrixMultiplication />
{/if}

{#if menuItems[1].active === true}
  <DynamicTSP />
{/if}

{#if menuItems[2].active === true}
  <UnboundedKnapsack />
{/if}

{#if menuItems[3].active === true}
  <EditDistance />
{/if}

{#if menuItems[4].active === true}
  <Hirschberg />
{/if}