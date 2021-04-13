<script>
  import * as _ from "lodash";

  let input = "a,b,c";

  let set;
  let ctArray = [];
  let isCommutative = false;
  let neutralElement = false;
  let inverseExists = false;
  let isAssociative = true;

  let generateArray = function (input) {
    set = _.compact(_.uniq(input.split(",")));
    ctArray = [...Array(set.length)].map((x) => Array(set.length).fill("0"));
    console.log(ctArray);
  };

  let logArray = function (array) {
    console.log(array);
  };

  let checkStats = function (array) {
    isCommutative = true;
    let cont = true;
    for (var i = 0; i < array.length; i++) {
      if (!cont) {
        break;
      }
      for (var j = 0; j < array[i].length; j++) {
        if (array[i][j] !== array[j][i]) {
          isCommutative = false;
          cont = false;
          break;
        }
      }
    }

    neutralElement = false;
    let leftNeutral = true;
    let rightNeutral = true;
    for (var i = 0; i < array.length; i++) {
      leftNeutral = true;
      for (var j = 0; j < array[i].length; j++) {
        if (leftNeutral === true && array[i][j] !== set[j]) {
          leftNeutral = false;
        }
      }
      if (!leftNeutral === false) {
        leftNeutral = set[i];
        console.log("leftneutral:", leftNeutral);
        break;
      }
    }

    for (var j = 0; j < array.length; j++) {
      rightNeutral = true;
      for (var i = 0; i < array[j].length; i++) {
        if (rightNeutral === true && array[i][j] !== set[i]) {
          rightNeutral = false;
        }
      }
      if (!rightNeutral === false) {
        rightNeutral = set[j];
        console.log("rightneutral:", rightNeutral);
        break;
      }
    }

    if (leftNeutral === rightNeutral) {
      neutralElement = leftNeutral;
    }

    if (neutralElement !== false) {
      inverseExists = false;
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
          if (array[i][j] === neutralElement) {
            console.log("inverse:");
            inverseExists = true;
            break;
          }
        }
        if (inverseExists === false) {
          break;
        }
      }
    }

    isAssociative = true;
    for (var i = 0; i < set.length; i++) {
      if (isAssociative !== true) {
        break;
      }
      for (var j = 0; j < set.length; j++) {
        if (isAssociative !== true) {
          break;
        }
        for (var k = 0; k < set.length; k++) {
          let jk = set.indexOf(array[j][k]);
          let ij = set.indexOf(array[i][j]);

          if (ij === -1 || jk === -1) {
            isAssociative = "Table is incomplete";
            break;
          }
          if (array[i][jk] !== array[ij][k]) {
            isAssociative = `${set[i]} * (${set[j]} * ${set[k]}) != (${set[i]} * ${set[j]}) * ${set[k]}`;
            break;
          }
        }
      }
    }
  };

  $: generateArray(input);
  $: logArray(ctArray);
  $: checkStats(ctArray);
</script>

<h1 class="text-3xl text-gray-700">Menge:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700">Last Tabelle:</h1>
<table>
  <tr>
    <td class="pl-4" />
    {#each set as element}
      <td class="pl-4">{element}</td>
    {/each}
  </tr>
  {#each ctArray as rows, i}
    <tr>
      <td class="pl-4">{set[i]}</td>
      {#each rows as row, j}
        <td class="pl-4">
          <input class="w-6" type="text" bind:value={ctArray[i][j]} />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<p>Abelsch: {isCommutative}</p>
<p>Neutrales Element: {neutralElement}</p>
{#if neutralElement !== false}
  <p>Inverses existiert: {inverseExists}</p>
{/if}
<p>Assoziativ: {isAssociative}</p>
