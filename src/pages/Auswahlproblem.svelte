<script>
  //   let input = getShuffledArray(10);
  let input = "6,12,8,10,5,2,14,16,13,7";
  let nSmallest = 2;
  let res = "";
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

  function findXSmallest(L, i) {
    successrun = [];
    let temp = [...L];
    while (true) {
      let resultString = [];
      let piv = temp[temp.length - 1];
      resultString.push(`i = ${i}`);
      resultString.push(`p = ${piv}`);
      let left = [];
      let right = [];
      for (var j = 0; j < temp.length; j++) {
        if (temp[j] < piv) {
          left.push(temp[j]);
        } else if (temp[j] > piv) {
          right.push(temp[j]);
        }
      }
      resultString.push(
        `${left
          .toString()
          .replaceAll(",", " ")} |${piv}| ${right
          .toString()
          .replaceAll(",", " ")}`
      );
      if (left.length > i - 1) {
        resultString.push(`|L1| = ${left.length} > i(${i}) - 1`);
        successrun.push(resultString);
        temp = [...left];
      } else if (left.length < i - 1) {
        resultString.push(`|L1| = ${left.length} < i(${i}) - 1`);
        successrun.push(resultString);
        temp = [...right];
        i = i - 1 - left.length;
      } else if (left.length === i - 1) {
        resultString.push(`|L1| = ${left.length} == i(${i}) - 1`);
        successrun.push(resultString);
        successrun = successrun;
        res = `${piv} ist das ${nSmallest}-kleinste Element`;
        return;
      }
    }
  }

  $: findXSmallest(list, nSmallest);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700">Finde n-kleinstes (1 - {list.length}):</h1>
<input class="w-1/2" type="number" bind:value={nSmallest} />

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

<table>
  {#each successrun as run}
    <tr>
      {#each run as entry}
        <td class="pl-6">{entry}</td>
      {/each}
    </tr>
  {/each}
</table>

<p>{res}</p>
