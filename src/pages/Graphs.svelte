<script>
  import GraphBuilder from "../components/Graphs/GraphBuilder.svelte";
  import Mengensysteme from "../components/Graphs/Mengensysteme.svelte";
  import Tarjan from '../components/Graphs/Tarjan.svelte';
  import Kruskal from '../components/Graphs/Kruskal.svelte';
  import Dijkstra from '../components/Graphs/Dijkstra.svelte';
  import TopologicalSorting from '../components/Graphs/TopologicalSorting.svelte';
  import TransitiveHull from '../components/Graphs/TransitiveHull.svelte';
  import Traversal from '../components/Graphs/Traversal.svelte';
  import Warshall from '../components/Graphs/Warshall.svelte';

  let menuItems = [
    {
      title: "Graphbuilder",
      active: true,
    },
    {
      title: "Tarjan",
      active: false,
    },
    {
      title: "Kruskal",
      active: false,
    },
    {
      title: "Dijkstra",
      active: false,
    },
    {
      title: "Topologische Sortierung",
      active: false,
    },
    {
      title: "Transitive Huelle",
      active: false,
    },
    {
      title: "Traversierung",
      active: false,
    },
    {
      title: "Warshall",
      active: false,
    }
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
  <GraphBuilder />
{/if}

{#if menuItems[1].active === true}
  <Tarjan />
{/if}

{#if menuItems[2].active === true}
  <Kruskal />
{/if}

{#if menuItems[3].active === true}
  <Dijkstra />
{/if}

{#if menuItems[4].active === true}
  <TopologicalSorting />
{/if}

{#if menuItems[5].active === true}
  <TransitiveHull />
{/if}

{#if menuItems[6].active === true}
  <Traversal />
{/if}

{#if menuItems[7].active === true}
  <Warshall />
{/if}