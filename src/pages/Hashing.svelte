<script>
  import { create, all } from "mathjs";
  import * as _ from "lodash";
  const config = {};
  const math = create(all, config);

  let input = "22,23,45,3,86,66";
  let hashTableSize = 10;
  let hashFunction = "k mod m";
  let collisionIterator = "(k + 3 * i) mod m";

  let hashTable = [];
  let successrun = [];

  let findResult = [];

  let resizeHashtable = function (size) {
    hashTable = [];
    successrun = [];
    for (var i = 0; i < size; i++) {
      hashTable[i] = undefined;
    }
  };

  $: resizeHashtable(hashTableSize);

  let insert = function (value) {
    let list = value.split(",").map((doc) => parseInt(doc));
    for (var j = 0; j < list.length; j++) {
      value = list[j];
      let scope = {
        k: value,
        m: hashTableSize,
      };
      let result = math.evaluate(hashFunction, scope);
      let i = 0;
      while (hashTable[result] !== undefined && hashTable[result] !== "*") {
        i += 1;
        // Collision move to iteration function
        scope = {
          k: value,
          i: i,
          m: hashTableSize,
        };
        result = math.evaluate(collisionIterator, scope);
      }
      hashTable[result] = value;
      successrun.push({
        hashtable: _.cloneDeep(hashTable),
        description: `Insert ${value}`,
        iterator: i,
      });
      successrun = successrun;
    }

    console.log(successrun);

    input = "";
    document.getElementById("input").focus();
  };

  let remove = function (value) {
    console.log("is this function even called?");
    let list = value.split(",").map((doc) => parseInt(doc));
    for (var j = 0; j < list.length; j++) {
      value = list[j];
      console.log(value);

      let scope = {
        k: value,
        m: hashTableSize,
      };
      let result = math.evaluate(hashFunction, scope);
      let i = 0;
      let counter = 0;
      console.log("result", result);
      while (hashTable[result] !== value) {
        i += 1;
        if (counter >= hashTable.length) {
          //   Value is not in hashtable
          return;
        }
        counter++;
        // Collision move to iteration function
        scope = {
          k: value,
          i: i,
          m: hashTableSize,
        };
        result = math.evaluate(collisionIterator, scope);
      }
      hashTable[result] = "*";
      successrun.push({
        hashtable: _.cloneDeep(hashTable),
        description: `Delete ${value}`,
        iterator: i,
      });
      successrun = successrun;
      input = "";
      document.getElementById("input").focus();
    }
  };

  let find = function (value) {
    findResult = [];
    // value = parseInt(value);

    let scope = {
      k: value,
      m: hashTableSize,
    };
    let result = math.evaluate(hashFunction, scope);
    let i = 0;
    let counter = 0;
    console.log(hashTable[result]);
    console.log(value);
    while (hashTable[result] !== value) {
      findResult.push(
        `${math.parse(hashFunction, scope).toString()} = ${result} => ${
          hashTable[result] || "-"
        }`
      );
      i += 1;
      if (counter >= hashTable.length || hashTable[result] === undefined) {
        //   Value is not in hashtable
        findResult.push("Nicht gefunden");
        return;
      }
      counter++;
      // Collision move to iteration function
      scope = {
        k: value,
        i: i,
        m: hashTableSize,
      };
      result = math.evaluate(collisionIterator, scope);
    }

    findResult.push(
      `${math.parse(hashFunction, scope).toString()} = ${result} => ${
        hashTable[result]
      }`
    );

    findResult.push("Gefunden");

    findResult = findResult;

    input = "";
    document.getElementById("input").focus();
  };
</script>

<h1 class="text-3xl text-gray-700">Hashtable size (m):</h1>
<input class="w-1/2" type="number" bind:value={hashTableSize} />

<h1 class="text-3xl text-gray-700">
  Hashfunction h<sub>0</sub>(k):
</h1>
<input class="w-1/2" type="text" bind:value={hashFunction} />

<h1 class="text-3xl text-gray-700">Hashfunction h<sub>i</sub>(k):</h1>
<input class="w-1/2" type="text" bind:value={collisionIterator} />

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={insert(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Insert</button
>
<button
  type="button"
  on:click={remove(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Delete</button
>
<button
  type="button"
  on:click={find(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Find</button
>

<table class="pt-2">
  <tr>
    {#each Array(hashTableSize) as tr, i}
      <th class="pl-4">{i}</th>
    {/each}
    <th class="pl-4">Schritt</th>
    <th class="pl-4">i bei erfolgreichem Einfuegen</th>
  </tr>

  <tr>
    {#each Array(hashTableSize) as tr, i}
      <td class="pl-4"
        ><input class="w-6" type="text" bind:value={hashTable[i]} /></td
      >
    {/each}
  </tr>

  {#each successrun as run}
    <tr>
      {#each run.hashtable as val}
        {#if val === undefined}
          <td class="pl-4">-</td>
        {:else}
          <td class="pl-4">{val}</td>
        {/if}
      {/each}
      <td class="pl-4">{run.description}</td>
      <td class="pl-4">{run.iterator}</td>
    </tr>
  {/each}
</table>

{#each findResult as step}
  <p>{step}</p>
{/each}
