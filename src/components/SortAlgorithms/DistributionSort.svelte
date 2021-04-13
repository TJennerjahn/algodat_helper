<script>
  import * as _ from "lodash";
  import { document } from "lodash/_freeGlobal";
  import { run } from "svelte/internal";
  let input = "";
  let kTuples = 3;
  let tupleList = [];
  let successrun = [];
  let bucketCount = 0;

  let alphabet = "abcdefghijklmnopqrstuvwxyz";
  alphabet = alphabet.toUpperCase();
  alphabet = alphabet.split("");

  let addTuple = function (value) {
    let inputArray = value.split(",");
    if (inputArray.length !== kTuples) {
      console.log("Incorrect Tuple");
      return;
    }
    for (var i = 0; i < inputArray.length; i++) {
      inputArray[i] = parseInt(inputArray[i]);
    }
    tupleList.push(_.cloneDeep(inputArray));
    tupleList = tupleList;

    input = "";
    document.getElementById("distributionSortInput").focus();
  };

  let distributionSort = function () {
    let unique = _.uniq(_.flatten(tupleList));
    unique.sort();
    bucketCount = unique.length;
    successrun = [];
    for (var i = 0; i < kTuples; i++) {
      let buckets = Array(bucketCount);
      for (var j = 0; j < buckets.length; j++) {
        buckets[j] = [];
      }
      for (var j = 0; j < tupleList.length; j++) {
        let val = tupleList[j][kTuples - i - 1];
        buckets[val - 1].push(_.cloneDeep(tupleList[j]));
      }
      successrun.push({
        buckets: _.cloneDeep(buckets),
      });
    }
    successrun = successrun;
    console.log(successrun);
  };

  $: distributionSort(tupleList);
</script>

<h1 class="text-3xl text-gray-700">Tuple size</h1>
<input class="w-1/2" type="number" bind:value={kTuples} />

<h1 class="text-3xl text-gray-700">Add Tuple:</h1>
<input
  id="distributionSortInput"
  class="w-1/2"
  type="text"
  bind:value={input}
/>
<button
  type="button"
  on:click={addTuple(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Add Tuple</button
>
<button
  type="button"
  on:click={distributionSort()}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Sort</button
>

<div class="block" />

{#each tupleList as tuple, i}
  <p>{i + 1} : {`(${tuple.toString()})`}</p>
{/each}

<table>
  <tr>
    {#each Array(bucketCount) as x, i}
      <th class="pl-4">Bucket {i + 1}</th>
    {/each}
    <!-- <th class="pl-4">Sortiert</th> -->
  </tr>

  {#each successrun as run, i}
    <tr>
      {#each run.buckets as bucket, j}
        <td class="pl-4">
          {#if bucket.length > 0}
            {#each bucket[j] as tuple, k}
              <span>{`(${tuple.toString()})`}</span>
            {/each}
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>
