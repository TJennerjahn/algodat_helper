<script>
  let matrixCount = 4;
  let matrices = [];

  let solutionMatrix = [];

  const initMatrices = (count) => {
    solutionMatrix = [];
    matrices = [];
    for (let i = 0; i < count; i++) {
      matrices.push({
        rows: 1,
        cols: 1,
      });
      let row = [];
      for (let j = 0; j < count; j++) {
        row[j] = {
          R: 0,
          K: i === j ? `A${j+1}` : '',
        };
      }
      solutionMatrix[i] = row;
    }

    idealMatrixMultiplication(matrices);
  };

  const idealMatrixMultiplication = (matrices) => {
    for (let diagonal = 1; diagonal < matrixCount; diagonal++) {
      for (
        let i = 0, j = diagonal;
        i < matrixCount && j < matrixCount;
        i++, j++
      ) {
        let solutionSpace = [];
        for(let k = i+1; k <= j; k++) {
            solutionSpace.push({
                R: solutionMatrix[i][k-1].R + solutionMatrix[k][j].R + (matrices[i].rows * matrices[k].rows * matrices[j].cols),
                // K: j == i +1 ? `A${i+1}A${j+1}`:`{i=${k}: ${solutionMatrix[i][k-1].R} + ${solutionMatrix[k][j].R} + ${(matrices[i].rows * matrices[k].rows * matrices[j].cols)}}`
                K: j === i+1 ?  `[A${i+1}A${j+1}]`:`[${solutionMatrix[i][k-1].K}${solutionMatrix[k][j].K}]`
            });
        }
        console.log('solutionSpace', solutionSpace.length);
        solutionMatrix[i][j].R = Math.min(...solutionSpace.map(doc => doc.R));
        let solutionIndex = solutionSpace.findIndex(el => el.R === solutionMatrix[i][j].R);
        solutionMatrix[i][j].K = solutionSpace[solutionIndex].K;

      }
    }
  };

  $: initMatrices(matrixCount);
  $: idealMatrixMultiplication(matrices);
</script>

<h1 class="text-xl text-gray-700">Anzahl Matrizen:</h1>
<input id="input" class="w-full" type="number" bind:value={matrixCount} />

{#each matrices as matrix, i}
  <p class="w-1/3">
    A
    <sub>{i + 1}</sub>
    :
    <input id="input" class="w-10" type="number" bind:value={matrix.rows} />
    x
    <input id="input" class="w-10" type="number" bind:value={matrix.cols} />
  </p>
{/each}

<table class="w-1/2">
  <tr>
    <td />
    {#each matrices as matrix, i}
      <td class="text-center">
        {matrix.rows} A
        <sub>{i + 1}</sub>
        {matrix.cols}
      </td>
    {/each}
  </tr>

  {#each matrices as matrix, i}
    <tr>
      <td class="text-right">
        {matrix.rows} A
        <sub>{i + 1}</sub>
        {matrix.cols}
      </td>
      {#each solutionMatrix[i] as element, j}
        <td>
          {#if j >= i}
            <div class="border-2 border-gray-400 rounded-md">
              <p>R: {element.R}</p>
              {#if i === j}
              <p>K: [{element.K}]</p>
              {:else}
              <p>K: {element.K}</p>
              {/if}
            </div>
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>
