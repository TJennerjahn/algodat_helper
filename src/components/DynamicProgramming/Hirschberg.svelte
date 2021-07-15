<script>
  import * as _ from "lodash";
  import ed from "edit-distance";

  let inputA = "INTENTION";
  let inputB = "EXECUTION";

  let hirschbergSolution = [];

  const hirschberg = (wordA, wordB) => {
    let hirschbergSolution = [];
    // let wordAArray = ("-" + wordA).split("");
    // let wordBArray = ("-" + wordB).split("");

    const recursiveHirschberg = (array1, array2) => {
      if (array1.length <= 1) {
        return;
      }

      let solution = {};

      // split array1 into two arrays of equal length
      let splitLength = Math.ceil(array1.length / 2);
      let topArray = ["-", ...array1.slice(0, splitLength)];
      let bottomArray = [...array1.slice(splitLength, array1.length), "-"];

      let leftArray = ["-", ...array2];
      let rightArray = [...array2, "-"];

      console.log(array1.length, array2.length);

      solution.top = topArray;
      solution.bottom = bottomArray;
      solution.left = leftArray;
      solution.right = rightArray;
      solution.alignmentRow = 0;

      let leftMatrix = [];
      for (let i = 0; i < leftArray.length; i++) {
        let row = [];
        for (let j = 0; j < topArray.length; j++) {
          if (i === 0) {
            row.push(j);
          } else if (j === 0) {
            row.push(i);
          } else {
            row.push(0);
          }
        }
        leftMatrix.push(row);
      }

      for (let i = 1; i < leftArray.length; i++) {
        for (let j = 1; j < topArray.length; j++) {
          let solutionSpace = [];
          solutionSpace.push(
            leftMatrix[i - 1][j - 1] + (leftArray[i] === topArray[j] ? 0 : 1)
          );
          solutionSpace.push(leftMatrix[i - 1][j] + 1);
          solutionSpace.push(leftMatrix[i][j - 1] + 1);

          let min = _.min(solutionSpace);
          leftMatrix[i][j] = min;
        }
      }

      solution.leftMatrix = leftMatrix;

      let rightMatrix = [];
      for (let i = rightArray.length - 1; i >= 0; i--) {
        let row = [];
        for (let j = bottomArray.length - 1; j >= 0; j--) {
          if (i === 0) {
            row.push(j);
          } else if (j === 0) {
            row.push(i);
          } else {
            row.push(0);
          }
        }
        rightMatrix.push(row);
      }

      //   loop over rightMatrix in reverse
      for (let i = rightArray.length - 2; i >= 0; i--) {
        for (let j = bottomArray.length - 2; j >= 0; j--) {
          let solutionSpace = [];
          solutionSpace.push(
            rightMatrix[i + 1][j + 1] +
              (rightArray[i] === bottomArray[j] ? 0 : 1)
          );
          solutionSpace.push(rightMatrix[i + 1][j] + 1);
          solutionSpace.push(rightMatrix[i][j + 1] + 1);
          let min = _.min(solutionSpace);
          rightMatrix[i][j] = min;
        }
      }

      solution.rightMatrix = rightMatrix;

      hirschbergSolution.push(solution);

      let minValue = Infinity;
      let minIndex = -1;
      for(let i = 0; i < leftArray.length; i++) {
          let sum = 0;
          sum += leftMatrix[i][topArray.length - 1];
          sum += rightMatrix[i][0];

          if(sum < minValue) {
            minValue = sum;
            minIndex = i;
          }
      }
      solution.alignmentRow = minIndex;
      splitLength = minIndex;
      recursiveHirschberg(topArray.slice(1), array2.slice(0, splitLength));
      recursiveHirschberg(
        bottomArray.slice(0, -1),
        array2.slice(splitLength, array2.length)
      );
    };

    recursiveHirschberg(wordA.split(""), wordB.split(""));
    // hirschbergSolution = hirschbergSolution;
    console.log(hirschbergSolution);

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

    console.log(lev.alignment());

    return hirschbergSolution;
  };
</script>

<button
  class="bg-gray-700 text-white p-2 rounded-md"
  on:click={(e) => {
    hirschbergSolution = hirschberg(inputA, inputB).sort((a,b) => b.top.length - a.top.length);
  }}
>
  Berechnen
</button>

<h1 class="text-xl text-gray-700">Wort 1:</h1>
<input type="text" class="w-1/3" bind:value={inputA} />

<h1 class="text-xl text-gray-700">Wort 2:</h1>
<input type="text" class="w-1/3" bind:value={inputB} />

{#each hirschbergSolution as solution}
  <div class="p-2 rounded-md border-2 border-gray-500 w-max mt-4">
    <table class="text-center">
      <tr>
        <td />
        {#each solution.top as top}
          <td class="w-10 h-10">{top}</td>
        {/each}
      </tr>

      {#each solution.left as left, i}
        <tr>
          <td class="w-10 h-10">{left}</td>
          {#each solution.leftMatrix[i] as leftMatrixRow, j}
            <td class="w-10 h-10 {solution.alignmentRow === i && j === solution.leftMatrix[i].length - 1 ? 'bg-red-500 text-white rounded-l-md' : ''}">{leftMatrixRow}</td>
          {/each}
          {#each solution.rightMatrix[i] as rightMatrixRow, j}
            <td class="w-10 h-10 {solution.alignmentRow === i && j === 0 ? 'bg-red-500 text-white rounded-r-md' : ''}">{rightMatrixRow}</td>
          {/each}
          <td class="w-10 h-10">{solution.right[i]}</td>
        </tr>
      {/each}
      <tr>
        <td class="w-10 h-10" />
        {#each solution.top as top}
          <td class="w-10 h-10" />
        {/each}
        {#each solution.bottom as bottom}
          <td class="w-10 h-10">{bottom}</td>
        {/each}
      </tr>
    </table>
  </div>
{/each}
