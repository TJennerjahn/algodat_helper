<script>
  // let input = "6,12,15,19,29,44,53,89,112,113,114,130,131,136,139,149,150,153,154,165,173,180,202,209,227,232,238,247,252,256,256,283";
  let input =
    "4,11,22,23,25,27,29,36,41,52,64,76,82,86,94,96,102,117,123,147,188,211,216,222,224,226,233,239,255,263,277,289";
  let search = 114;
  let list = [];
  let successrun = [];

  function transformList(transform) {
    list = transform.split(",").map((doc) => parseInt(doc));
  }

  $: transformList(input);

  function binarySearch(element, l) {
    successrun = [];
    if (l.length === 0) {
      successrun.push("List ist leer!");
      return -1;
    } else {
      let start = 0;
      let end = l.length - 1;

      while (true) {
        let mid = start + Math.floor((end - start + 1) / 2);
        successrun.push(
          `Suche ${start}...${end}, mid = ${start} + ${Math.floor(
            (end - start + 1) / 2
          )} = ${mid}, L[${mid}] = ${l[mid]}`
        );
        if (l[mid] === element) {
          successrun.push("Element gefunden!");
          return;
        }
        if (start === end) {
          successrun.push("Element nicht gefunden!");
          return;
        } else if (l[mid] < element) {
          start = mid + 1;
        } else if (l[mid] > element) {
          end = mid - 1;
        }
      }
    }
  }

  $: binarySearch(search, list);
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
