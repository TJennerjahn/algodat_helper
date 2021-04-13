<script>
  import { PrefixTree } from "../../utils/PrefixTrees.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import { tick } from "svelte";
  let input = "A,to,tea,ted,ten,i,in,inn";
  let prefixTree;

  let createTree = async function () {
    let list = input.split(",");
    prefixTree = new PrefixTree(list);
    console.log(prefixTree);
    prefixTree.create();
    let graph = prefixTree.asGraph(prefixTree.root);
    await tick();
    createGraph({ graph: graph }, ".cytoscape");
  };
</script>

<h1 class="text-3xl text-gray-700">Wortliste:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={() => {
    createTree();
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2"
  >Create Prefix Tree</button
>

<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Prefix Tree</p>
  <div id="treebuilder" class="cytoscape" />
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 750px;
    display: block;
  }
</style>
