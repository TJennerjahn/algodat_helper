<script>
  import * as _ from "lodash";

  let startX = 6;
  let startN = 187;

  let pollardRhoSolution = [];

  const pollardRho = (n, currentX) => {
    let solution = [];
    let i = 0;
    let previousX = "-";
    let y = currentX;
    let k = 2;
    let d = 1;
    solution.push({
      i: i,
      modx: "-",
      x: currentX,
      y: y,
      k: k,
      d: "-",
    });
    while (i < 100) {
      i++;
      previousX = currentX;
      currentX = (currentX * currentX - 1) % n;
      d = Math.abs(gcd(y - currentX, n));
      if (d !== 1 && d !== n) {
        solution.push({
          i: i,
          modx: (previousX * previousX - 1),
          x: currentX,
          y: y,
          k: k,
          d: d,
        });
        pollardRhoSolution = solution;
        return solution;
      }
      if (i + 1 === k) {
        y = currentX;
        k *= 2;
      }

      solution.push({
        i: i,
        modx: (previousX * previousX - 1),
        x: currentX,
        y: y,
        k: k,
        d: d,
      });
    }
    pollardRhoSolution = solution;
    return solution;
  };

  // function to calculate greatest common divisor
  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }
</script>

<h1 class="text-xl text-gray-700">n:</h1>
<input type="number" class="w-1/3" bind:value={startN} />

<h1 class="text-xl text-gray-700">
  X
  <sub>1</sub>
</h1>
<div class="flex">
  <input type="text" class="w-1/3" bind:value={startX} />
  <button
    class="bg-gray-700 text-white p-2 rounded-md"
    on:click={(e) => {
      startX = Math.floor(Math.random() * startN);
    }}
  >
    Zufall
  </button>
</div>

<button
  class="bg-gray-700 text-white p-2 rounded-md"
  on:click={(e) => {
    let result = pollardRho(startN, startX);
    console.log(result);
  }}
>
  Berechnen
</button>

<table class="w-1/3 text-center">
  <tr>
    <th>i</th>
    <th>x<sup>2</sup><sub>i-1</sub> - 1</th>
    <th>
      x
      <sub>i</sub>
    </th>
    <th>y</th>
    <th>k</th>
    <th>d</th>
  </tr>
  {#each pollardRhoSolution as solution}
    <tr>
      <td>{solution.i + 1}</td>
      <td>{solution.modx}</td>
      <td>{solution.x}</td>
      <td>{solution.y}</td>
      <td>{solution.k}</td>
      <td>{solution.d}</td>
    </tr>
  {/each}
</table>
