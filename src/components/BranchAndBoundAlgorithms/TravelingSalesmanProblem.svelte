<script>
  import * as _ from "lodash";
  import matrix from "matrix-js";
  import { TravelingSalesmanTree } from "../../utils/TravelingSalesmanTree";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import { tick } from "svelte";

  let matrixSize = 4;

  let adjacencyMatrix = [["-","9","3","5"],["9","-","1","6"],["3","1","-","7"],["5","6","7","-"]];
// let adjacencyMatrix = [["-","1","7","10","3"],["1","-","7","1","2"],["7","7","-","5","3"],["10","1","5","-","8"],["3","2","3","8","-"]];


  const setMatrixSize = (size) => {
    adjacencyMatrix = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        if (i === j) {
          row.push("-");
        } else {
          row.push(0);
        }
      }
      adjacencyMatrix.push(row);
    }
  };

  $: setMatrixSize(matrixSize);

  let testTree;
  let graph = {};
  const createTree = async () => {
    testTree = new TravelingSalesmanTree(adjacencyMatrix);
    testTree.create();

    graph.graphId = `TestGraph`;
    graph.graph = testTree.asGraph(testTree.root);
    graph.title = `Test`;

    await tick();
    createGraph(graph, `.${graph.graphId}`);
    console.log(testTree);
  };
</script>

<h1 class="text-3xl text-gray-700 mt-2 inline">Adjazenzmatrix:</h1>
<input class="text-xl" type="number" bind:value={matrixSize} />

<table>
  <tr>
    <th />
    {#each adjacencyMatrix as row, i}
      <th>{i + 1}</th>
    {/each}
  </tr>
  {#each adjacencyMatrix as row, i}
    <tr>
      <td>{i + 1}</td>
      {#each row as el, j}
        <td>
          <input
            class="w-12 m-1"
            type="text"
            bind:value={adjacencyMatrix[i][j]}
          />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<button
  on:click={() => {
    createTree();
  }}
  class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
>
  Berechnen
</button>

<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Rundreise</p>
  <div class="cytoscape TestGraph" />
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }

  .TestGraph {
    width: 100%;
    height: 600px;
    display: block;
  }
</style>
