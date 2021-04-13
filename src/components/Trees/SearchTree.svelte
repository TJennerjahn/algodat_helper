<script>
  import { tick } from "svelte";
  import { getRandomInt } from "../../utils/rand.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";

  import { BinTree } from "../../utils/BinTrees.js";
  let input = "";
  let binTree = new BinTree();
  console.log(binTree);
  let graphs = [];

  var addToTree = async function (value) {
    if (value === undefined || value === "") {
      value = getRandomInt(1000);
    }
    value = parseInt(value);

    if (value) {
      binTree.add(value);
      let graph = binTree.asGraph(binTree.getRoot());
      graphs.push({
        graphId: `graph_${graphs.length}`,
        graph: graph,
        title: `Insert ${value}`,
        maxDepth: binTree.maxDepth(binTree.getRoot()),
        isStrict: binTree.isStrict(),
        isBalanced: binTree.isBalanced(binTree.getRoot()),
        isAlmostComplete: binTree.isAlmostComplete(binTree.getRoot()),
        isComplete: binTree.isComplete(),
      });
      graphs = graphs;
      await tick();
      createGraph(
        graphs[graphs.length - 1],
        `.${graphs[graphs.length - 1].graphId}`
      );
    }
  };

  var deleteFromTree = async function (value) {
    if (value === undefined || value === "") {
      return;
    }
    value = parseInt(value);

    if (value) {
      binTree.delete(value);
      let graph = binTree.asGraph(binTree.getRoot());
      graphs.push({
        graphId: `graph_${graphs.length}`,
        graph: graph,
        title: `Delete ${value}`,
        maxDepth: binTree.maxDepth(binTree.getRoot()),
        isStrict: binTree.isStrict(),
        isBalanced: binTree.isBalanced(binTree.getRoot()),
        isAlmostComplete: binTree.isAlmostComplete(binTree.getRoot()),
        isComplete: binTree.isComplete(),
      });
      graphs = graphs;
      await tick();
      createGraph(
        graphs[graphs.length - 1],
        `.${graphs[graphs.length - 1].graphId}`
      );
    }
  };
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={() => {
    addToTree(input);
    input = "";
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2"
  >Add to Tree</button
>
<button
  type="button"
  on:click={() => {
    deleteFromTree(input);
    input = "";
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2"
  >Delete from Tree</button
>
<div class="grid gap-4 grid-cols-3">
  {#each graphs as graph, i}
    <div
      class="flex flex-col justify-content-center border border-gray-500 mt-2 rounded-md"
    >
      <p class="text-center pt-2">{graph.title}</p>
      <div class="cytoscape {graph.graphId}" />

      <div class="grid gap-2 grid-cols-3">
        <span>Tiefe: {graph.maxDepth - 1}</span>
        <span>Strikt: {graph.isStrict}</span>
        <span>Ausgeglichen: {graph.isBalanced}</span>
        <span>Fast vollst.: {graph.isAlmostComplete}</span>
        <span>Vollst.: {graph.isComplete}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }
</style>
