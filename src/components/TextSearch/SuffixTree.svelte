<script>
  import { tick } from "svelte";
  import { getRandomInt } from "../../utils/rand.js";
  import { createGraph } from "../../utils/cytoscapehelper.js";
  import * as _ from "lodash";

  import { SuffixTree, SuffixTreeNode } from "../../utils/SuffixTrees.js";
  //   let input = "STETSTESTE";
  let input = "STETSTESTE$";
  //   let binTree = new BinTree();

  let suffixes = [];
  let enhancedSuffixArray = [];
  let suffixTree;

  let createTree = async function (pattern) {
    suffixTree = new SuffixTree(pattern);
    suffixes = suffixTree.root.suffixes;

    enhancedSuffixArray = _.cloneDeep(suffixes);
    enhancedSuffixArray.sort();
    // console.log("enhanced suffix array", temp);

    suffixTree.createRec(suffixTree.root);
    let graph = suffixTree.asGraph(suffixTree.root);
    console.log(graph);
    await tick();
    console.log(suffixTree);
    createGraph({ graph: graph }, ".cytoscape");
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
  >Create Suffix Tree</button
>

<div class="flex">
  <table>
    <tr>
      <th class="pl-4">k</th>
      <th class="pl-4">Suf<sub>k</sub></th>
      <th class="pl-4">i</th>
      <th class="pl-4">SA[i]</th>
      <th class="pl-4">Suf<sub>SA[i]</sub></th>
      <th class="pl-4">LCP</th>
    </tr>
    {#each suffixes as suffix, i}
      <tr>
        <td class="pl-4">{i}</td>
        <td class="pl-4">{suffix}</td>
        <td class="pl-4">{i}</td>
        <td class="pl-4">{suffixes.indexOf(enhancedSuffixArray[i])}</td>
        <td class="pl-4">{enhancedSuffixArray[i]}</td>
        <td class="pl-4"
          >{i === 0
            ? "-"
            : suffixTree.longestCommonPrefix([
                enhancedSuffixArray[i - 1],
                enhancedSuffixArray[i],
              ]).length}</td
        >
      </tr>
    {/each}
  </table>
</div>

<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Suffix Tree</p>
  <div id="treebuilder" class="cytoscape" />
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 750px;
    display: block;
  }
</style>
