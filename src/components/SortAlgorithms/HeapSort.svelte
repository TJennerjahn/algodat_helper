<script>
  import { BinTree } from "../../utils/BinTrees.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import { tick } from "svelte";

  //   let input = "2,5,7,1,6,4,3";
  let input = "2,4,3,5,1,6,7";
  let binTree = new BinTree();
  let graphs = [];
  let heapLog = [];
  let array_length;

  let createTree = async function (input) {
    // transform input to array;
    let list = input.split(",").map((doc) => parseInt(doc));
    binTree.generateFromArray(list, "levelOrder");
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

  let swap = function (array, index_A, index_B) {
    let string = `Swapping ${array[index_A]} with ${array[index_B]} ==> `;
    let title = `Swapping ${array[index_A]} with ${array[index_B]}`;
    var temp = array[index_A];

    array[index_A] = array[index_B];
    array[index_B] = temp;

    string += `[${array.toString()}]`;
    binTree.generateFromArray([...array], "levelOrder");
    let graph = binTree.asGraph(binTree.getRoot());
    let nodeIndex = graph.findIndex((gr) => gr.data.label === array[index_A]);
    graph[nodeIndex].data.color = "red";
    nodeIndex = graph.findIndex((gr) => gr.data.label === array[index_B]);
    graph[nodeIndex].data.color = "red";
    console.log(graph);
    graphs.push({
      graphId: `graph_${graphs.length}`,
      graph: graph,
      title: title,
      maxDepth: binTree.maxDepth(binTree.getRoot()),
      isStrict: binTree.isStrict(),
      isBalanced: binTree.isBalanced(binTree.getRoot()),
      isAlmostComplete: binTree.isAlmostComplete(binTree.getRoot()),
      isComplete: binTree.isComplete(),
    });
    graphs = graphs;
    console.log(string);
    heapLog.push(string);
  };

  let heap_root = function (array, i) {
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    var max = i;

    if (left < array_length && array[left] > array[max]) {
      max = left;
    }

    if (right < array_length && array[right] > array[max]) {
      max = right;
    }

    if (max != i) {
      swap(array, i, max);
      heap_root(array, max);
    }
  };

  let heapSort = function (array) {
    array_length = array.length;

    console.log("Create Heap:");
    heapLog.push("Create Heap");
    for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
      heap_root(array, i);
    }

    console.log("Sort Heap:");
    heapLog.push("\n Sort Heap");
    for (i = array.length - 1; i > 0; i--) {
      swap(array, 0, i);
      array_length--;
      heap_root(array, 0);
      console.log("---");
      heapLog.push("---");
    }
  };

  let start = async function (input) {
    heapLog = [];
    let list = input.split(",").map((doc) => parseInt(doc));
    heapSort(list);

    for (var i = 0; i < graphs.length; i++) {
      await tick();
      createGraph(graphs[i], `.${graphs[i].graphId}`);
    }

    heapLog = heapLog;
    console.log(heapLog);
  };
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={() => {
    createTree(input);
    // input = "";
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2"
  >Create from Array</button
>
<button
  type="button"
  on:click={() => {
    start(input);
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Sort</button
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

<div>
  {#each heapLog as entry}
    <p class="text-lg">{entry}</p>
  {/each}
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }
</style>
