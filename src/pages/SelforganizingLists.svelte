<script>
  let input = "1,5,6,7,14,15,18,19,21,22,23,26,28,30,31,34,35";
  let search = 7;
  let list = [];
  let searchFor = [];

  let frequencyCount = [];
  let moveToFront = [];
  let transpose = [];

  function transformList(transform) {
    list = transform.split(",").map((doc) => {
      return {
        val: parseInt(doc),
        priority: 0,
      };
    });
  }

  $: transformList(input);

  function retrieveElement(element) {
    // Frequency Count
    let temp;
    if (frequencyCount.length === 0) {
      temp = [...list];
    } else {
      temp = [...frequencyCount[frequencyCount.length - 1]];
    }
    let index = temp.findIndex((i) => i.val === element);
    if (index !== -1) {
      searchFor.push(element);
      frequencyCount.push(temp);

      frequencyCount[frequencyCount.length - 1][index].priority++;
      frequencyCount[frequencyCount.length - 1].sort((a, b) =>
        a.priority > b.priority ? -1 : b.priority > a.priority ? 1 : 0
      );
    }

    // MoveToFront
    temp = [];
    if (moveToFront.length === 0) {
      temp = [...list];
    } else {
      temp = [...moveToFront[moveToFront.length - 1]];
    }
    index = temp.find((i) => i.val === element);
    if (index !== undefined) {
      temp = temp.filter((item) => item !== index);
      temp.unshift(index);
      moveToFront = [...moveToFront, temp];
    }

    // Transpose
    temp = [];
    if (transpose.length === 0) {
      temp = [...list];
    } else {
      temp = [...transpose[transpose.length - 1]];
    }
    index = temp.findIndex((i) => i.val === element);
    if (index !== -1) {
      let el = temp[index];
      if (index > 0) {
        temp[index] = temp[index - 1];
        temp[index - 1] = el;
      }
      transpose = [...transpose, temp];
    }
  }
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700">Gesuchtes Element:</h1>
<input type="number" class="w-1/2" bind:value={search} />
<button
  type="button"
  on:click={retrieveElement(search)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md block mt-2"
  >Suchen</button
>

<h1 class="mt-6 text-3xl text-gray-700">Frequency Count:</h1>
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
      <th class="pl-4">{entry.val}</th>
    {/each}
  </tr>
  {#each frequencyCount as run, i}
    <tr>
      <td>Suche nach {searchFor[i]}</td>
      {#each run as entry}
        <td class="pl-4">{entry.val}</td>
      {/each}
    </tr>
  {/each}
</table>

<h1 class="mt-6 text-3xl text-gray-700">Move To Front:</h1>
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
      <th class="pl-4">{entry.val}</th>
    {/each}
  </tr>
  {#each moveToFront as run, i}
    <tr>
      <td>Suche nach {searchFor[i]}</td>
      {#each run as entry}
        <td class="pl-4">{entry.val}</td>
      {/each}
    </tr>
  {/each}
</table>

<h1 class="mt-6 text-3xl text-gray-700">Transpose:</h1>
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
      <th class="pl-4">{entry.val}</th>
    {/each}
  </tr>
  {#each transpose as run, i}
    <tr>
      <td>Suche nach {searchFor[i]}</td>
      {#each run as entry}
        <td class="pl-4">{entry.val}</td>
      {/each}
    </tr>
  {/each}
</table>
