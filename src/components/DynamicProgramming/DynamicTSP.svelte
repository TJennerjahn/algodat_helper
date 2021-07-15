<script>
  import { i } from "mathjs/lib/cjs/entry/pureFunctionsAny.generated";

  let matrixSize = 5;

  let adjacencyMatrix = [
    ["0", "2", "3", "5", "4"],
    ["2", "0", "1", "3", "6"],
    ["2", "1", "0", "7", "5"],
    ["6", "4", "5", "0", "3"],
    ["3", "6", "4", "3", "0"],
  ];
  // let adjacencyMatrix = [["-","1","7","10","3"],["1","-","7","1","2"],["7","7","-","5","3"],["10","1","5","-","8"],["3","2","3","8","-"]];

  let gSolutionDictionary = {};

  let solutionArray = [];

  const setMatrixSize = (size) => {
    adjacencyMatrix = [];
    gSolutionDictionary = {};
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(0);
      }
      adjacencyMatrix.push(row);
    }
  };

  const g = (i, S) => {
    i++;
    S = S.map((doc) => doc + 1);
    if (gSolutionDictionary[`g(${i},{${S.toString()}})`] !== undefined) {
      return gSolutionDictionary[`g(${i},{${S.toString()}})`].value;
    }
    if (S.length === 0) {
      gSolutionDictionary[`g(${i},{})`] = {
        value: parseInt(adjacencyMatrix[i - 1][0]),
        text: "",
      };
      return gSolutionDictionary[`g(${i},{})`].value;
    } else {
      let solutionSpace = [];
      for (let j = 0; j < S.length; j++) {
        solutionSpace.push(
          parseInt(adjacencyMatrix[i - 1][S[j] - 1]) +
            g(
              S[j] - 1,
              S.filter((el) => el !== S[j]).map((doc) => doc - 1)
            )
        );
      }
      let solutionKey = `min[`;
      for (let j = 0; j < S.length; j++) {
        solutionKey += ` d(${i},${S[j]}) + g(${S[j]},{${S.filter(
          (el) => el !== S[j]
        ).toString()}}) = ${solutionSpace[j]} ,`;
      }
      solutionKey = solutionKey.slice(0, -1);
      solutionKey += `]`;
      gSolutionDictionary[`g(${i},{${S.toString()}})`] = {
        value: Math.min(...solutionSpace),
        text: solutionKey,
      };

      return gSolutionDictionary[`g(${i},{${S.toString()}})`].value;
    }
  };

  const dynamicTSP = () => {
    gSolutionDictionary = {};
    solutionArray = [];
    let S = [];
    for (let i = 1; i < matrixSize; i++) {
      S.push(i);
      g(i, []);
    }
    g(0, S);

    let sortedKeys = Object.keys(gSolutionDictionary);
    sortedKeys.sort((a, b) => a.length - b.length);

    for (let i = 0; i < sortedKeys.length; i++) {
      solutionArray.push(
        `${sortedKeys[i]} = ${gSolutionDictionary[sortedKeys[i]].text} = ${
          gSolutionDictionary[sortedKeys[i]].value
        }`
      );
      // console.log(`${sortedKeys[i]}:${gSolutionDictionary[sortedKeys[i]]}`);
    }

    solutionArray = solutionArray;

    console.log(gSolutionDictionary);
  };

  $: setMatrixSize(matrixSize);
</script>

<h1 class="text-3xl text-gray-700 mt-2 inline">Adjazenzmatrix:</h1>
<input class="text-xl" type="number" bind:value={matrixSize} />

<table>
  <tr>
    <th />
    {#each adjacencyMatrix as row, i}
      <th>{i + 1}</th>
    {/each}
  </tr>
  {#each adjacencyMatrix as row, i}
    <tr>
      <td>{i + 1}</td>
      {#each row as el, j}
        <td>
          <input
            class="w-12 m-1"
            type="text"
            bind:value={adjacencyMatrix[i][j]}
          />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<div class="flex items-center w-1/3">
  <button
    on:click={() => {
      dynamicTSP();
    }}
    class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
  >
    Berechnen
  </button>
</div>

{#each solutionArray as element}
  <p>{element}</p>
{/each}
