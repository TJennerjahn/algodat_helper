<script>
  // let text = "ABABABCBABABCABABCAB";
  // let pattern = "ABABCABAB";
  let text = "ABRABARABRARADABRADARABAR";
  let pattern = "ARABA";
  let comparisons = [];

  let next = [];

  function buildNextTable(pattern) {
    next = [];
    let i = 0;
    let j = -1;
    next[i] = j;
    while (i < pattern.length) {
      while (j >= 0 && pattern[j] !== pattern[i]) {
        j = next[j];
      }
      i++;
      j++;
      next[i] = j;
    }
    console.log("next", next);
  }

  $: buildNextTable(pattern);

  function kmp2(text, pattern) {
    comparisons = [];

    for (let i = 0; i < pattern.length; i++) {
      comparisons[i] = [];
      for (let j = 0; j < text.length; j++) {
        comparisons[i][j] = " ";
      }
    }
    console.log(comparisons);

    let i = 0;
    let j = 0;
    while (i < text.length) {
      while (j >= 0 && text[i] !== pattern[j]) {
        comparisons[j][i] = "-";
        j = next[j];
      }
      if (j !== -1) {
        comparisons[j][i] = "+";
      }

      j++;
      i++;
      if (j === pattern.length) {
        console.log(i - pattern.length);
        j = next[j];
        return;
      }
    }
  }

  // $: result = kmp(text, pattern);
  $: kmp2(text, pattern);
</script>

<h1 class="text-3xl text-gray-700">Text:</h1>
<input class="w-1/2" type="text" bind:value={text} />

<h1 class="text-3xl text-gray-700">Pattern:</h1>
<input class="w-1/2" type="text" bind:value={pattern} />

<h1 class="mt-6 text-3xl text-gray-700">Next Tabelle:</h1>
<table>
  <tr>
    <th>j</th>
    {#each [...pattern] as char, i}
      <th class="pl-4">{i}</th>
    {/each}
  </tr>
  <tr>
    <td>Pattern[j]</td>
    {#each [...pattern] as char, i}
      <td class="pl-4">{char}</td>
    {/each}
  </tr>
  <tr>
    <td>Next[j]</td>
    {#each [...pattern] as char, i}
      <td class="pl-4">{next[i]}</td>
    {/each}
  </tr>
</table>

<h1 class="mt-6 text-3xl text-gray-700">Vergleiche:</h1>
<table>
  <tr>
    <th class="pl-4" />
    <th class="pl-4" />
    {#each text.split("") as char, i}
      <th class="pl-4">{char}</th>
    {/each}
  </tr>
  <tr>
    <th class="pl-4" />
    <th class="pl-4" />
    {#each text.split("") as char, i}
      <th class="pl-4">{i}</th>
    {/each}
  </tr>
  {#each pattern.split("").reverse() as char, i}
    <tr>
      <td class="pl-4">{char}</td>
      <td class="pl-4">{pattern.length - i - 1}</td>
      {#each text.split("") as text, j}
        <td class="pl-4">{comparisons[pattern.length - i - 1][j]}</td>
      {/each}
    </tr>
  {/each}
</table>
