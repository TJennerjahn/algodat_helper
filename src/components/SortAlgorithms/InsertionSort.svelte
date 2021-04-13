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

  // function insertionSort(l) {
  //   successrun = [];
  //   let temp = [...l];
  //   let res = [];
  //   while (temp.length > 0) {
  //     res.push(temp[0]);
  //     res.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  //     temp.shift();

  //     successrun.push([...res, ...temp]);
  //   }
  // }

  function insertionSort(l) {
    successrun = [];
    let clone = [...l];
    for (var i = 1; i < clone.length; i++) {
      let temp = clone[i];
      var j = i;
      while (j > 0 && clone[j - 1] > temp) {
        clone[j] = clone[j - 1];
        successrun.push([`i = ${i}, j = ${j}`, ...clone]);
        j--;
        // console.log(i, j, clone);
      }
      clone[j] = temp;

      // console.log(i, j, clone);
      successrun.push([`i = ${i}, j = ${j}`, ...clone]);
    }
  }

  $: insertionSort(list);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="mt-6 text-3xl text-gray-700">Tabelle:</h1>
<table>
  <tr>
    <th>i</th>
    {#each list as entry, i}
      <th class="pl-4">{i}</th>
    {/each}
  </tr>
  <tr>
    <td>L[i]</td>
    {#each list as entry, i}
      <th class="pl-4">{entry}</th>
    {/each}
  </tr>
  {#each successrun as run, i}
    <tr>
      <!-- <td>Schritt {i + 1}</td> -->
      {#each run as entry}
        <td class="pl-4">{entry}</td>
      {/each}
    </tr>
  {/each}
</table>
