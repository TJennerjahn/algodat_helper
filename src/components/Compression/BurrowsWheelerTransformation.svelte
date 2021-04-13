<script>
  import * as _ from "lodash";

  let input = "STETSTESTE";
  let rotations = [];
  let lexicalOrder = [];
  let bwtCode = "";
  let bwtIndex;
  let bwtArray = [];
  let sortedBwtArray = [];
  let transform = function (value) {
    rotations = [];
    lexicalOrder = [];
    for (var i = 0; i < value.length; i++) {
      rotations.push(value);
      value = `${value.substring(1)}${value[0]}`;
    }
    lexicalOrder = _.cloneDeep(rotations);
    lexicalOrder.sort();

    console.log(rotations);
    console.log(lexicalOrder);

    bwtCode = "";
    for (var i = 0; i < lexicalOrder.length; i++) {
      bwtCode += lexicalOrder[i][lexicalOrder.length - 1];
    }
    bwtIndex = lexicalOrder.indexOf(value);
    console.log(bwtCode);
  };

  let decode = function (value) {
    bwtArray = bwtCode.split("");
    sortedBwtArray = _.cloneDeep(bwtArray);
    sortedBwtArray.sort();
  };

  $: transform(input);
  $: decode(input);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />

<table>
  <tr>
    <th class="pl-10">Input</th>
    <th class="pl-10">i</th>
    <th class="pl-4">Rotationen</th>
    <th class="pl-10">i</th>
    <th class="pl-4">Sortiert</th>
    <th class="pl-10">Output</th>
  </tr>
  {#each rotations as rotation, i}
    <tr>
      <td class="pl-10"
        >{i === Math.floor(rotations.length / 2) ? input : ""}</td
      >
      <td class="pl-10">{i}</td>
      <td class="pl-4 text-left">{rotation}</td>
      <td class="pl-10">{rotations.indexOf(lexicalOrder[i])}</td>
      <td class="pl-4 text-left">{lexicalOrder[i]}</td>
      <td class="pl-10 text-left"
        >{i === Math.floor(rotations.length / 2)
          ? `${bwtCode} ${bwtIndex}`
          : ""}</td
      >
    </tr>
  {/each}
</table>

<h1 class="text-3xl text-gray-700">Dekodierung:</h1>
<table>
  <tr>
    <th class="pl-10">BWT Code</th>
    <th class="pl-10">Sortiert</th>
    <th class="pl-10">Abgeleitete Reihenfolge</th>
  </tr>
  {#each bwtArray as entry, i}
    <tr>
      <td class="pl-10">{i}:{entry}</td>
      <td class="pl-10"
        >{sortedBwtArray[i]}:{bwtArray.indexOf(sortedBwtArray[i])}</td
      >
    </tr>
  {/each}
</table>
