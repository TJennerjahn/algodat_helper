<script>
  import * as _ from "lodash";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let input = "";
  let encodedInput = "";
  let decodedInput = "";

  let successrun = [];
  let decodedrun = [];

  let transform = function (value) {
    encodedInput = "";
    successrun = [];
    alphabet = alphabet.toUpperCase();
    let alphabetArray = alphabet.split("");
    alphabetArray = _.uniq(alphabetArray);
    alphabetArray.sort();
    value = value.toUpperCase();
    for (var i = 0; i < value.length; i++) {
      let index = alphabetArray.indexOf(value[i]);
      let newAlphabet = _.cloneDeep(alphabetArray);
      let temp = newAlphabet.splice(index, 1);
      newAlphabet.unshift(temp[0]);
      encodedInput += `${index.toString()} `;
      successrun.push({
        text: value,
        output: index,
        previousAlphabet: alphabetArray.toString(),
        newAlphabet: newAlphabet.toString(),
      });
      alphabetArray = _.cloneDeep(newAlphabet);
    }
  };

  let decode = function (value) {
    decodedrun = [];
    decodedInput = "";
    alphabet = alphabet.toUpperCase();
    let alphabetArray = alphabet.split("");
    alphabetArray = _.uniq(alphabetArray);
    alphabetArray.sort();
    value = value.split(" ");
    value = _.compact(value);
    for (var i = 0; i < value.length; i++) {
      let newAlphabet = _.cloneDeep(alphabetArray);
      let temp = newAlphabet.splice(parseInt(value[i]), 1);
      newAlphabet.unshift(temp[0]);
      decodedInput += temp[0];
      decodedrun.push({
        text: value,
        output: temp[0],
        previousAlphabet: alphabetArray,
        newAlphabet: newAlphabet,
      });

      alphabetArray = _.cloneDeep(newAlphabet);
    }
  };

  $: transform(input);
  $: decode(encodedInput);
</script>

<h1 class="text-3xl text-gray-700">Alphabet:</h1>
<input id="input" class="w-1/2" type="text" bind:value={alphabet} />

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />

<table>
  <tr>
    <th class="pl-4">Eingabe</th>
    <th class="pl-4">Ausgabe</th>
    <th class="pl-4">Alphabet vorher</th>
    <th class="pl-4">Alphabet hinterher</th>
  </tr>

  {#each successrun as run, i}
    <tr>
      <td class="pl-4">
        {#each run.text.split("") as character, j}
          <span class={i === j ? `text-red-500` : `text-black`}
            >{character}</span
          >
        {/each}
      </td>
      <td class="pl-4">{run.output}</td>
      <td class="pl-4">
        {#each run.previousAlphabet.split(",") as character, j}
          <span class={run.output === j ? `text-red-500` : `text-black`}
            >{character}</span
          >
        {/each}
      </td>
      <td class="pl-4">
        {#each run.newAlphabet.split(",") as character, j}
          <span class={j === 0 ? `text-red-500` : `text-black`}
            >{character}</span
          >
        {/each}
      </td>
    </tr>
  {/each}
</table>

<p class="pt-2">Encoded Input: {encodedInput}</p>

<h1 class="text-3xl text-gray-700">Decode:</h1>
<table>
  <tr>
    <th class="pl-4">Eingabe</th>
    <th class="pl-4">Ausgabe</th>
    <th class="pl-4">Alphabet vorher</th>
    <th class="pl-4">Alphabet hinterher</th>
  </tr>

  {#each decodedrun as run, i}
    <tr>
      <td class="pl-4">
        {#each run.text as character, j}
          <span class={i === j ? `text-red-500` : `text-black`}
            >{character}</span
          >
        {/each}
      </td>
      <td class="pl-4">{run.output}</td>
      <td class="pl-4">
        {#each run.previousAlphabet as character, j}
          <span
            class={parseInt(run.text[j]) === j ? `text-red-500` : `text-black`}
            >{character}</span
          >
        {/each}
      </td>
      <td class="pl-4">
        {#each run.newAlphabet as character, j}
          <span class={j === 0 ? `text-red-500` : `text-black`}
            >{character}</span
          >
        {/each}
      </td>
    </tr>
  {/each}
</table>

<p class="pt-2">Decoded Input: {decodedInput}</p>
