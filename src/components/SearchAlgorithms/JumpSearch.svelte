<script>
  let input = "1,5,6,7,14,15,18,19,21,22,23,26,28,30,31,34,35";
  let search = 34;
  let list = [];
  let successrun = [];

  let jumpCost = 1;
  let compareCost = 1;
  let m = 0;

  function transformList(transform) {
    list = transform.split(",").map((doc) => parseInt(doc));
  }

  $: transformList(input);

  function jumpSearch(element, l, a, b) {
    m = 0;
    successrun = [];
    if (l.length === 0) {
      successrun.push("List ist leer!");
      return;
    }
    m = Math.floor(Math.sqrt((a / b) * l.length));

    for (var i = m; i < l.length; i += m) {
      if (l[i] <= element) {
        successrun.push(
          `Springe zu L[${i}] = ${l[i]} <= ${element}; Springe weiter;`
        );
      } else {
        successrun.push(
          `Springe zu L[${i}] = ${l[i]} > ${element}; Durchsuche L[${
            i - m
          }] bis L[${i - 1}];`
        );
        for (var j = i - m; j < i; j++) {
          successrun.push(`Vergleiche L[${j}] = ${l[j]} mit ${element}`);
          if (l[j] === element) {
            successrun.push(`Element gefunden!`);
            return;
          }
        }
        successrun.push(`Element nicht gefunden!`);
        return;
      }
    }
    successrun.push();
  }

  $: jumpSearch(search, list, jumpCost, compareCost);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700">Gesuchtes Element:</h1>
<input type="number" class="w-1/2" bind:value={search} />

<h1 class="text-3xl text-gray-700">Sprungkosten:</h1>
<input class="w-1/2" type="number" bind:value={jumpCost} />

<h1 class="text-3xl text-gray-700">Vergleichskosten:</h1>
<input type="number" class="w-1/2" bind:value={compareCost} />

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
