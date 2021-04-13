<script>
  import { tick } from "svelte";
  import { getRandomInt } from "../../utils/rand.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import * as _ from "lodash";

  import { AVLTree } from "../../utils/AVLTrees.js";
  // let input = "9,20,5,23,14,2,35,13,15,19";
  // let input = "5,1,3,4,7,12,6,10,9,8";
  let input = "15,7,23,6,16,25,24";
  let avlTree = new AVLTree();
  console.log(avlTree);
  let graphs = [];

  let addList = async function (list) {
    list = list.split(",");
    for (var i = 0; i < list.length; i++) {
      addToTree(list[i]);
      await tick();
      await tick();
    }
  };

  var deleteFromTree = async function (value) {
    value = parseInt(value);
    if (value) {
      let graphQueue = [];
      avlTree.remove(value);
      let graph = avlTree.asGraph(avlTree.root);
      graphQueue.push({
        graphId: `graph_${graphs.length + graphQueue.length}`,
        graph: graph,
        title: `Delete ${value}`,
      });

      let balanceResult = avlTree.balance(avlTree.deletedParent);
      while (balanceResult !== false) {
        graph = avlTree.asGraph(avlTree.root);
        graphQueue.push({
          graphId: `graph_${graphs.length + graphQueue.length}`,
          graph: graph,
          title: balanceResult,
        });
        balanceResult = avlTree.balance(avlTree.deletedParent);
      }

      for (var i = 0; i < graphQueue.length; i++) {
        graphs.push(graphQueue[i]);
        graphs = graphs;
        await tick();
        createGraph(
          graphs[graphs.length - 1],
          `.${graphs[graphs.length - 1].graphId}`
        );
      }
    }
  };

  var addToTree = async function (value) {
    if (value === undefined || value === "") {
      value = getRandomInt(1000);
    }
    value = parseInt(value);

    if (value) {
      let graphQueue = [];

      avlTree.add(value);
      let graph = avlTree.asGraph(avlTree.root);
      graphQueue.push({
        graphId: `graph_${graphs.length + graphQueue.length}`,
        graph: graph,
        title: `Insert ${value}`,
      });

      let balanceResult = avlTree.balance(avlTree.newestNode);
      while (balanceResult !== false) {
        graph = avlTree.asGraph(avlTree.root);
        graphQueue.push({
          graphId: `graph_${graphs.length + graphQueue.length}`,
          graph: graph,
          title: balanceResult,
        });
        balanceResult = avlTree.balance(avlTree.newestNode);
      }

      for (var i = 0; i < graphQueue.length; i++) {
        graphs.push(graphQueue[i]);
        graphs = graphs;
        await tick();
        createGraph(
          graphs[graphs.length - 1],
          `.${graphs[graphs.length - 1].graphId}`
        );
      }
    }
  };
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={() => {
    addList(input);
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
