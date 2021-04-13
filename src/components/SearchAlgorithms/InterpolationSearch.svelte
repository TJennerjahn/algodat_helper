<script>
  let input = "1,5,6,7,14,15,18,19,21,22,23,26,28,30,31,34,35";
  let search = 7;
  let list = [];
  let successrun = [];
  let pos = 0;

  function transformList(transform) {
    list = transform.split(",").map((doc) => parseInt(doc));
  }

  $: transformList(input);

  function interpolationSearch(element, l) {
    pos = 0;
    successrun = [];
    if (l.length === 0) {
      successrun.push("Liste ist leer!");
      return;
    }
    successrun.push(`Suche ${element}:`);
    let start = 0;
    let end = l.length - 1;

    while (element >= l[start] && element <= l[end]) {
      pos =
        start + ((element - l[start]) / (l[end] - l[start])) * (end - start);
      pos = Math.floor(pos);
      successrun.push(
        `${start}...${end} ---> p = ${start} + (${element} - ${l[start]})/(${l[end]} - ${l[start]}) * (${end} - ${start}) = ${pos}`
      );

      successrun.push(`Vergleiche L[${pos}] = ${l[pos]} mit ${element}`);
      if (l[pos] === element) {
        successrun.push("Element gefunden");
        return;
      } else if (element > l[pos]) {
        start = pos + 1;
      } else if (element < l[pos]) {
        end = pos - 1;
      }
    }
    successrun.push("Element nicht gefunden!");
  }

  $: interpolationSearch(search, list);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700">Gesuchtes Element:</h1>
<input type="number" class="w-1/2" bind:value={search} />

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
{#each successrun as entry}
  <p>{entry}</p>
{/each}
