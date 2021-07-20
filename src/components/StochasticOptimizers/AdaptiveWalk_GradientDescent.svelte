<script>
  import * as _ from "lodash";

  let matrixSize = 4;
  let minimize = true;
  let fitnessMatrix = [];

  let adaptiveWalkSolution = [];
  let gradientDescentSolution = [];

  let allowDiagonalTraveling = false;

  const initMatrix = (size) => {
    fitnessMatrix = [];
    for (let i = 0; i < size; i++) {
      fitnessMatrix[i] = [];
      for (let j = 0; j < size; j++) {
        //   init to a random int between 1 and 10
        fitnessMatrix[i][j] = Math.floor(Math.random() * 10) + 1;
      }
    }
  };

  $: initMatrix(matrixSize);

  $: console.log(minimize);

  const adaptiveWalk = (matrix, row, col) => {
    let solution = [
      {
        row: row,
        col: col,
        value: matrix[row][col],
      },
    ];
    let currentMax = matrix[row][col];

    let neighbors = [];
    if (row > 0) {
      neighbors.push({
        row: row - 1,
        col: col,
        value: matrix[row - 1][col],
      });
    }
    if (row < matrixSize - 1) {
      neighbors.push({
        row: row + 1,
        col: col,
        value: matrix[row + 1][col],
      });
    }
    if (col > 0) {
      neighbors.push({
        row: row,
        col: col - 1,
        value: matrix[row][col - 1],
      });
    }
    if (col < matrixSize - 1) {
      neighbors.push({
        row: row,
        col: col + 1,
        value: matrix[row][col + 1],
      });
    }
    if (allowDiagonalTraveling) {
      if (row > 0 && col > 0) {
        neighbors.push({
          row: row - 1,
          col: col - 1,
          value: matrix[row - 1][col - 1],
        });
      }
      if (row < matrixSize - 1 && col < matrixSize - 1) {
        neighbors.push({
          row: row + 1,
          col: col + 1,
          value: matrix[row + 1][col + 1],
        });
      }
      if (row < matrixSize - 1 && col > 0) {
        neighbors.push({
          row: row + 1,
          col: col - 1,
          value: matrix[row + 1][col - 1],
        });
      }
      if (row > 0 && col < matrixSize - 1) {
        neighbors.push({
          row: row - 1,
          col: col + 1,
          value: matrix[row - 1][col + 1],
        });
      }
    }
    if(minimize){
        neighbors.sort((a, b) => a.value - b.value);
    } else {
        neighbors.sort((a, b) => b.value - a.value);
    }
    if (neighbors[0].value > currentMax) {
      solution = solution.concat(
        adaptiveWalk(matrix, neighbors[0].row, neighbors[0].col)
      );
    }
    return solution;
  };

  const gradientDescent = (matrix, startRow, startCol) => {
    gradientDescentSolution = [];

    const gradientDescentRecursive = (matrix, row, col, currentSolution) => {
      let currentMax = matrix[row][col];
      let neighbors = [];
      if (row > 0) {
        neighbors.push({
          row: row - 1,
          col: col,
          value: matrix[row - 1][col],
        });
      }
      if (row < matrixSize - 1) {
        neighbors.push({
          row: row + 1,
          col: col,
          value: matrix[row + 1][col],
        });
      }
      if (col > 0) {
        neighbors.push({
          row: row,
          col: col - 1,
          value: matrix[row][col - 1],
        });
      }
      if (col < matrixSize - 1) {
        neighbors.push({
          row: row,
          col: col + 1,
          value: matrix[row][col + 1],
        });
      }
      if (allowDiagonalTraveling) {
        if (row > 0 && col > 0) {
          neighbors.push({
            row: row - 1,
            col: col - 1,
            value: matrix[row - 1][col - 1],
          });
        }
        if (row < matrixSize - 1 && col < matrixSize - 1) {
          neighbors.push({
            row: row + 1,
            col: col + 1,
            value: matrix[row + 1][col + 1],
          });
        }
        if (row < matrixSize - 1 && col > 0) {
          neighbors.push({
            row: row + 1,
            col: col - 1,
            value: matrix[row + 1][col - 1],
          });
        }
        if (row > 0 && col < matrixSize - 1) {
          neighbors.push({
            row: row - 1,
            col: col + 1,
            value: matrix[row - 1][col + 1],
          });
        }
      }
      if(minimize) {
        neighbors = neighbors.filter((neighbor) => neighbor.value < currentMax);
      } else {
        neighbors = neighbors.filter((neighbor) => neighbor.value > currentMax);
      }
      if (neighbors.length > 0) {
        for (let i = 0; i < neighbors.length; i++) {
          let solution = _.cloneDeep(currentSolution);
          solution.push(neighbors[i]);
          gradientDescentRecursive(
            matrix,
            neighbors[i].row,
            neighbors[i].col,
            solution
          );
        }
      } else {
        gradientDescentSolution.push(_.cloneDeep(currentSolution));
      }
    };

    let currentSolution = [
      {
        row: startRow,
        col: startCol,
        value: matrix[startRow][startCol],
      },
    ];

    gradientDescentRecursive(
      matrix,
      startRow,
      startCol,
      _.cloneDeep(currentSolution)
    );
  };
</script>

<h1>Matrix size:</h1>
<input type="number" class="w-1/3" bind:value={matrixSize} />

<h1 class="mt-2">Minimieren oder maximieren</h1>
<div>
  <label>
    <input type="radio" value={true} bind:group={minimize} />
    Minimieren
  </label>
</div>

<div>
  <label>
    <input type="radio" value={false} bind:group={minimize} />
    Maximieren
  </label>
</div>


<h1 class="mt-2">Diagonalen erlauben</h1>
<input type="checkbox" bind:checked={allowDiagonalTraveling} />

<div class="flex flex-row gap-x-4">
  <table>
    {#each fitnessMatrix as row, i}
      <tr>
        {#each fitnessMatrix[i] as col, j}
          <td>
            <input
              type="number"
              class="w-16 h-10 mb-1 mr-1"
              bind:value={fitnessMatrix[i][j]}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </table>

  <table>
    {#each fitnessMatrix as row, i}
      <tr>
        {#each fitnessMatrix[i] as col, j}
          <td>
            <button
              on:click={() => {
                adaptiveWalkSolution = adaptiveWalk(fitnessMatrix, i, j);
                gradientDescent(fitnessMatrix, i, j);
                console.log(adaptiveWalkSolution);
                console.log(gradientDescentSolution);
              }}
              class="bg-gray-700 text-white w-16 h-10 rounded-md mb-1 mr-1"
            >
              {fitnessMatrix[i][j]}
            </button>
          </td>
        {/each}
      </tr>
    {/each}
  </table>
</div>

<h1 class="mt-2">Adaptive Walk Solution:</h1>
<p>{adaptiveWalkSolution.map((s) => s.value).join(", ")}</p>

<h1 class="mt-2">Gradient Descent Solutions:</h1>
{#each gradientDescentSolution as solution}
  <p>{solution.map((s) => s.value).join(", ")}</p>
{/each}
