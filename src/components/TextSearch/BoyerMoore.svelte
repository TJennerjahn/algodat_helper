<script>
  import _ from "lodash";
  // let text = "hoola-hoola_girls_like_hooligans";
  let text = "ABRABARABRARADABRADARABAR";
  let pattern = "ARABA";

  let unique = [];
  let last = [];
  let result = [];

  let successrun = [];

  let comparisons = [];

  function createLast(text, pattern) {
    unique = _.union([...text], [...pattern]);
    unique.sort();
    last = [];
    for (var i = 0; i < unique.length; i++) {
      last[i] = pattern.lastIndexOf(unique[i]);
    }
  }

  function boyermoore2(text, pattern) {
    successrun = [];
    createLast(text, pattern);
    let i = 0;
    while (i <= text.length - pattern.length) {
      let run = [];
      for (let init = 0; init < text.length; init++) {
        run[init] = " ";
      }
      let j = pattern.length - 1;
      run[i + j] = pattern[j];
      for (let init = 0; init < pattern.length; init++) {
        run[i + init] = pattern[init].toLowerCase();
      }
      while (j >= 0 && pattern[j] === text[i + j]) {
        run[i + j] = pattern[j];
        j--;
      }
      successrun.push(_.cloneDeep(run));
      if (j < 0) {
        return i;
      } else {
        let index = unique.indexOf(text[i + j]);
        if ((index !== -1 ? last[index] : -1) > j) {
          i++;
        } else {
          let offset = j - (index !== -1 ? last[index] : -1);
          i = i + offset;
        }
      }
    }
    console.log(-1);
    return -1;
  }

  $: createLast(text, pattern);
  $: boyermoore2(text, pattern);
</script>

<h1 class="text-3xl text-gray-700">Text:</h1>
<input class="w-1/2" type="text" bind:value={text} />

<h1 class="text-3xl text-gray-700">Pattern:</h1>
<input class="w-1/2" type="text" bind:value={pattern} />

<h1 class="text-3xl text-gray-700">Last Tabelle:</h1>
<table>
  <tr>
    <th>Alphabet</th>
    {#each unique as char, i}
      <th class="pl-4">{char}</th>
    {/each}
  </tr>
  <tr>
    <th>last</th>
    {#each last as char, i}
      <th class="pl-4">{char}</th>
    {/each}
  </tr>
</table>

<h1 class="text-3xl text-gray-700">Vergleiche:</h1>
<table>
  <tr>
    {#each text.split("") as char, i}
      <th class="pl-4">{i}</th>
    {/each}
  </tr>
  <tr>
    {#each text.split("") as char, i}
      <th class="pl-4">{char}</th>
    {/each}
  </tr>
  {#each successrun as run}
    <tr>
      {#each run as char}
        <td class="pl-4">{char}</td>
      {/each}
    </tr>
  {/each}
</table>

<!-- <h1 class="text-3xl text-gray-700">Vergleiche:</h1>
<table>
  <tr>
    <th>i</th>
    {#each [...text] as char, i}
      <th class="pl-4">{i}</th>
    {/each}
  </tr>
  <tr>
    <td>string</td>
    {#each [...text] as char, i}
      <td class="pl-4">{char}</td>
    {/each}
  </tr>
  {#each result as run}
    <tr>
      <td />
      {#each run as res, i}
        <td class="pl-4 {res.color}">{res.char}</td>
      {/each}
    </tr>
  {/each}
</table> -->
