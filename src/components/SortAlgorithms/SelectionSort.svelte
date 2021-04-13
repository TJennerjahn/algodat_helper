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

  function selectionSort(l) {
    successrun = [];
    let temp = [...l];
    let res = [];
    while (temp.length > 0) {
      let min = Math.min(...temp);
      let index = temp.indexOf(min);
      temp.splice(index, 1);
      res.push(min);

      successrun.push([...res, ...temp]);
      successrun = successrun;
    }
  }

  $: selectionSort(list);
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
      <td>Schritt {i + 1}</td>
      {#each run as entry}
        <td class="pl-4">{entry}</td>
      {/each}
    </tr>
  {/each}
</table>
