<script>
  import TreeBuilder from "../components/Trees/TreeBuilder.svelte";
  import LevelOrderTree from "../components/Trees/LevelOrderTree.svelte";
  import SearchTree from "../components/Trees/SearchTree.svelte";
  import AVLTree from "../components/Trees/AVLTree.svelte";
  import BTree from "../components/Trees/BTree.svelte";
  import * as _ from "lodash";

  let menuItems = [
    {
      title: "Tree-Builder",
      active: true,
    },
    {
      title: "Level Order",
      active: false,
    },
    {
      title: "Search Tree",
      active: false,
    },
    {
      title: "AVL Tree",
      active: false,
    },
    {
      title: "B-Tree",
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
  <TreeBuilder />
{/if}

{#if menuItems[1].active === true}
  <LevelOrderTree />
{/if}

{#if menuItems[2].active === true}
  <SearchTree />
{/if}

{#if menuItems[3].active === true}
  <AVLTree />
{/if}
{#if menuItems[4].active === true}
  <BTree />
{/if}

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }
</style>
