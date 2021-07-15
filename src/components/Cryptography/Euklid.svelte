<script>
  import * as _ from "lodash";

  let inputA = 120;
  let inputB = 23;

  let solution = [];

  const euklid = (a, b) => {
    if (b === 0) {
      solution.push({
        a: a,
        b: b,
        div: "-",
        d: a,
        x: 0,
        y: 1,
      });
      return { d: a, y: 1, x: 0 };
    }

    let result = euklid(b, a % b);

    let temp = {
      d: result.d,
      y: result.x,
      x: result.y - Math.floor(a / b) * result.x,
    };
    solution.push({
      a: a,
      b: b,
      div: Math.floor(a / b),
      d: temp.d,
      x: temp.y,
      y: temp.x,
    });
    return temp;
  };

  console.log(euklid(120, 23));
  solution.reverse();
  console.table(solution);
</script>

<h1 class="text-xl text-gray-700">a:</h1>
<input type="number" class="w-1/3" bind:value={inputA} />

<h1 class="text-xl text-gray-700">b:</h1>
<input type="number" class="w-1/3" bind:value={inputB} />

<button
  class="bg-gray-700 text-white p-2 rounded-md block"
  on:click={(e) => {
    solution = [];
    euklid(inputA, inputB);
    solution.reverse();
    solution = solution;
  }}
>
  Berechnen
</button>

<table class="w-1/3 text-center">
  <tr>
    <td>a</td>
    <td>b</td>
    <td>a/b</td>
    <td>d</td>
    <td>x</td>
    <td>y</td>
  </tr>
  {#each solution as s}
    <tr>
      <td>{s.a}</td>
      <td>{s.b}</td>
      <td>{s.div}</td>
      <td>{s.d}</td>
      <td>{s.x}</td>
      <td>{s.y}</td>
    </tr>
  {/each}
</table>
