<script>
  import * as _ from "lodash";
  import { HuffmanTree } from "../../utils/HuffmanTrees.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import { tick } from "svelte";

  let huffmanTree;
  let input = "DER RENTNER RENNT VOR RENTIEREN DAVON";

  let createTree = async function (value) {
    huffmanTree = new HuffmanTree(value);
    console.log(huffmanTree);
    huffmanTree.create();
    let graph = huffmanTree.asGraph(huffmanTree.root);
    console.log(graph);
    await tick();
    console.log(huffmanTree);
    createGraph({ graph: graph }, ".cytoscape");
  };

  let dec2bin = function (dec) {
    return (dec >>> 0).toString(2);
  };
</script>

<h1 class="text-3xl text-gray-700">Pattern T$:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={() => {
    createTree(input);
    input = "";
  }}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2"
  >Create Huffman Tree</button
>

{#if huffmanTree}
  <table>
    <tr>
      <th class="pl-4">Element</th>
      <th class="pl-4">Vorkommen</th>
      <th class="pl-4">Code</th>
    </tr>
    {#each huffmanTree.occurrences as oc, i}
      <tr>
        <td class="pl-4">{oc.character}</td>
        <td class="pl-4">{oc.count}</td>
        <td class="pl-4">{oc.code}</td>
      </tr>
    {/each}
  </table>

  <p>Encoded Version: {huffmanTree.encodedVersion}</p>
  <p>
    Encoded Length: {huffmanTree.encodedVersion.replaceAll(" ", "").length} Bits
  </p>
  <p>
    Unencoded Length: {dec2bin(huffmanTree.alphabet.length).length *
      huffmanTree.text.length} Bits
  </p>
  <p>
    Saved {dec2bin(huffmanTree.alphabet.length).length *
      huffmanTree.text.length -
      huffmanTree.encodedVersion.replaceAll(" ", "").length} Bits
  </p>

  <div class="border border-gray-500 mt-2 rounded-md">
    <p class="text-center pt-2">Huffman Tree</p>
    <div id="treebuilder" class="cytoscape" />
  </div>
{/if}

<style>
  .cytoscape {
    width: 100%;
    height: 750px;
    display: block;
  }
</style>
