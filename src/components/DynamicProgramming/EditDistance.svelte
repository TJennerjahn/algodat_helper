<script>
  import * as _ from "lodash";
  import ed from "edit-distance";

  let inputA = "ELEPHANT";
  let inputB = "RELEVANT";

  let editDistanceSolution = {
    wordA: "",
    wordB: "",
    matrix: [],
    distance: 0,
    alignment: {
      alignmentA: "",
      alignmentB: "",
    },
  };

  const editDistance = (wordA, wordB) => {
    let wordAArray = ("-" + wordA).split("");
    let wordBArray = ("-" + wordB).split("");

    editDistanceSolution.wordA = wordAArray.join("");
    editDistanceSolution.wordB = wordBArray.join("");

    let matrix = [];
    for (let i = 0; i < wordBArray.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < wordAArray.length; j++) {
        if (i === 0) {
          matrix[i][j] = j;
        } else if (j === 0) {
          matrix[i][j] = i;
        }
      }
    }

    // loop through matrix
    for (let i = 1; i < wordBArray.length; i++) {
      for (let j = 1; j < wordAArray.length; j++) {
        let solutionSpace = [];
        solutionSpace.push(
          matrix[i - 1][j - 1] + (wordBArray[i] === wordAArray[j] ? 0 : 1)
        );
        solutionSpace.push(matrix[i - 1][j] + 1);
        solutionSpace.push(matrix[i][j - 1] + 1);

        matrix[i][j] = Math.min(...solutionSpace);
      }
    }

    editDistanceSolution.matrix = matrix;

    console.log(editDistanceSolution);
    console.table(editDistanceSolution.matrix);

    // let difference = minimumEditDistance.diff(inputA, inputB);
    // console.log(difference);

    let lev = ed.levenshtein(
      wordA,
      wordB,
      () => {
        return 1;
      },
      () => {
        return 1;
      },
      (a, b) => {
        return a === b ? 0 : 1;
      }
    );
    console.log(lev);
    // console.log("Levenshtein", lev.distance, lev.pairs(), lev.alignment());
    editDistanceSolution.distance = lev.distance;
    editDistanceSolution.alignment = lev.alignment();
  };
</script>

<button
  class="bg-gray-700 text-white p-2 rounded-md"
  on:click={(e) => {
    editDistance(inputA, inputB);
  }}
>
  Berechnen
</button>

<h1 class="text-xl text-gray-700">Wort 1:</h1>
<input type="text" class="w-1/3" bind:value={inputA} />

<h1 class="text-xl text-gray-700">Wort 2:</h1>
<input type="text" class="w-1/3" bind:value={inputB} />

<table class="w-1/2 text-center">
  <tr>
    <th />
    {#each editDistanceSolution.wordA.split("") as letter}
      <th>{letter}</th>
    {/each}
  </tr>

  {#each editDistanceSolution.wordB.split("") as letter, i}
    <tr>
      <td>{letter}</td>
      {#each editDistanceSolution.wordA.split("") as letterA, j}
        <!-- <td>{editDistanceSolution.matrix[i][j]}</td> -->
        <td>{editDistanceSolution.matrix[i][j]}</td>
      {/each}
    </tr>
  {/each}
</table>

<p>Editier Distanz: {editDistanceSolution.distance}</p>
<table>
  <tr>
    {#each editDistanceSolution.alignment.alignmentA as letter}
      <td>{letter === null ? "-" :letter}</td>
    {/each}
  </tr>
  <tr>
    {#each editDistanceSolution.alignment.alignmentB as letter}
      <td>{letter === null ? "-" :letter}</td>
    {/each}
  </tr>
</table>
