<script>
  import { tick } from "svelte";
  import { getRandomInt } from "../../utils/rand.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import { BinTree } from "../../utils/BinTrees.js";
  let input = "";
  let binTree = new BinTree();
  console.log("LevelOrder", binTree);
  let graphs = [];

  var addToTree = async function (input) {
    if (input === undefined || input === "") {
      input = getRandomInt(1000);
    }
    input = parseInt(input);
    let temp = binTree.printLevelOrder(binTree.getRoot());
    binTree.generateFromArray([...temp, input], "levelOrder");
    let graph = binTree.asGraph(binTree.getRoot());
    graphs.push({
      graphId: `graph_${graphs.length}`,
      graph: graph,
      title: `Insert ${input}`,
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
  };

  var maxheapify = async function () {
    let result = binTree.buildMaxHeap(binTree.getRoot());
    console.log(result);
    for (var i = 0; i < result.length; i++) {
      graphs.push({
        graphId: `graph_${graphs.length}`,
        graph: result[i],
        title: `Insert input`,
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
<input id="input" class="w-1/2" type="number" bind:value={input} />
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
    maxheapify(input);
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2"
  >Max Heapify</button
>
<!-- Step By Step Tree -->
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
