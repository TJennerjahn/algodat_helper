<script>
  //   let input = getShuffledArray(10);
  //   let input = "7,5,1,4,3,6,2";
  let input = "47,9,22,45,42,44,22";
  let list = [];
  let A = [];
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
    A = [...list];
    successrun = [];
  }

  //   $: transformList(input);

  function qsort(l, r) {
    if (r <= l) {
      return;
    }
    var i = l;
    var j = r;
    var pivIndex = parseInt((l + r) / 2);
    var piv = A[pivIndex];
    let resultString = [];
    do {
      while (A[i] < piv) {
        i++;
      }
      while (A[j] > piv) {
        j--;
      }
      if (i <= j) {
        var temp = A[i];
        A[i] = A[j];
        A[j] = temp;
        i++;
        j--;
      }
    } while (i <= j);

    resultString.push(`l = ${l};`);
    resultString.push(`r = ${r};`);
    resultString.push(`piv=A[${pivIndex}]=${piv};`);
    resultString.push(
      `${A.slice(0, l).toString().replaceAll(",", " ")}|${A.slice(l, r + 1)
        .toString()
        .replaceAll(",", " ")}| ${A.slice(r + 1, A.length)
        .toString()
        .replaceAll(",", " ")}`
    );
    resultString.push(`qsort(A, ${l}, ${j});`);
    resultString.push(`qsort(A, ${i}, ${r});`);
    successrun.push(resultString);
    successrun = successrun;
    qsort(l, j);
    qsort(i, r);
  }

  transformList(input);
  $: qsort(0, A.length - 1);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={transformList(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md block mt-2"
  >Sortieren</button
>

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
</table>

<h1 class="mt-6 text-3xl text-gray-700">Ablauf:</h1>
<table />
{#each successrun as run}
  <tr>
    {#each run as entry}
      <td class="pl-6">{entry}</td>
    {/each}
  </tr>
{/each}
