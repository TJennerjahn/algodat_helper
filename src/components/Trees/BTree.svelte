<script>
  import { tick } from "svelte";
  import { getRandomInt } from "../../utils/rand.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";

  import { BTree } from "../../utils/BTrees.js";
  // let input = "30,40,28,2,97,84,14,35,64,66,10,87";
  let input = "40,20,60,10,50,55,30,15,51,45,52";

  let order = 2;
  let sidePreferenceForDeletion = 0;

  let tree;

  let bTree = undefined; //new BTree(order, sidePreferenceForDeletion);
  // console.log(bTree);
  let graphs = [];

  var addToTree = async function (value) {
    let list = value.split(",").map((doc) => parseInt(doc));
    for (var i = 0; i < list.length; i++) {
      bTree.insert(list[i]);
    }

    let graph = bTree.asGraph(bTree.root);
    graphs.push({
      graphId: `graph_${graphs.length}`,
      graph: graph,
      title: `Insert ${input}`,
    });
    graphs = graphs;
    await tick();
    createGraph(
      graphs[graphs.length - 1],
      `.${graphs[graphs.length - 1].graphId}`
    );
  };

  var deleteFromTree = async function (value) {
    if (value === undefined || value === "") {
      return;
    }
    value = parseInt(value);

    if (value) {
      bTree.delete(value);
      let graph = bTree.asGraph(bTree.root);
      graphs.push({
        graphId: `graph_${graphs.length}`,
        graph: graph,
        title: `Delete ${value}`,
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

{#if bTree === undefined}
  <h1 class="text-3xl text-gray-700">Order (t=):</h1>
  <input class="w-1/2" type="number" bind:value={order} />

  <h1 class="text-3xl pt-2 text-gray-700">Preferenz bei Ersetzungen</h1>
  <select bind:value={sidePreferenceForDeletion}>
    <option value={0}> Linker Teilbaum </option>
    <option value={1}> Rechter Teilbaum </option>
  </select>

  <button
    type="button"
    on:click={() => {
      console.log(order, sidePreferenceForDeletion);
      bTree = new BTree(order, sidePreferenceForDeletion);
    }}
    class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2 block"
    >Create Tree</button
  >
{/if}

{#if bTree}
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
      </div>
    {/each}
  </div>
{/if}

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }
</style>
