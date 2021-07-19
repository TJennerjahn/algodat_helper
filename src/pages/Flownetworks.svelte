<script>
  import Flowbuilder from "../components/Flownetworks/Flowbuilder.svelte";
  import MinCutMaxFlow from "../components/Flownetworks/MinCutMaxFlow.svelte";
  import FordFulkerson from "../components/Flownetworks/FordFulkerson.svelte";
  import PushRelabel from '../components/Flownetworks/PushRelabel.svelte';

  let menuItems = [
    { title: "Flowbuilder", active: true },
    { title: "Min-Cut Max-Flow", active: false },
    { title: "Ford-Fulkerson", active: false },
    { title: "Push Relable", active: false }
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
  <Flowbuilder />
{/if}

{#if menuItems[1].active === true}
  <MinCutMaxFlow />
{/if}

{#if menuItems[2].active === true}
  <FordFulkerson />
{/if}

{#if menuItems[3].active === true}
  <PushRelabel />
{/if}
