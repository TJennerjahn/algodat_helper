<script>
  let input = getShuffledArray(10);
  let list = [];
  let successrun = [];

  function getShuffledArray(arraySize) {
    const array = new Array(arraySize);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * 100;
    }
    let ratio = Math.max.apply(Math, array) / 100;
    for (var i = 0; i < array.length; i++) {
      array[i] = parseInt(array[i] / ratio).toString();
    }
    return array.join(",");
  }

  function transformList(transform) {
    list = transform.split(",").map((doc) => parseInt(doc));
  }

  $: transformList(input);

  function bubbleSort(l) {
    successrun = [];
    let temp = [...l];
    for (var n = temp.length; n > 1; n--) {
      for (var i = 0; i < n - 1; i++) {
        if (temp[i] > temp[i + 1]) {
          let x = temp[i];
          temp[i] = temp[i + 1];
          temp[i + 1] = x;
        }
        successrun.push([`i = ${n}, j = ${i}`, ...temp]);
      }
    }
  }

  $: bubbleSort(list);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="mt-6 text-3xl text-gray-700">Tabelle:</h1>
<table>
  <tr>
    <th>Index</th>
    {#each list as entry, i}
      <th class="pl-4">{i}</th>
    {/each}
  </tr>
  <tr>
    <td class="pl-4">L[Index]</td>
    {#each list as entry, i}
      <th class="pl-4">{entry}</th>
    {/each}
  </tr>
  {#each successrun as run, i}
    <tr>
      <!-- <td>Schritt {i + 1}</td> -->
      {#each run as entry, j}
        <td class="pl-4">{entry}</td>
      {/each}
    </tr>
  {/each}
</table>
