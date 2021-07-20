<script>
  import * as _ from "lodash";
  import { e } from "mathjs/lib/cjs/entry/pureFunctionsAny.generated";

  let elementCount = 4;

  let t = 1;

  let elements = [];

  let metropolisSolution = [];

  const initElements = (count) => {
    elements = [];
    for (let i = 0; i < count; i++) {
      elements[i] = 0;
    }
  };

  const metropolisWalk = (eles, tDiv) => {
    metropolisSolution = [];
    for (let i = 0; i < elementCount; i++) {
        for(let j = 0; j < elementCount; j++) {
            if(i === j) {
                continue;
            }

            metropolisSolution.push({
                from: i,
                to: j,
                probability: eles[j] < eles[i] ? 1 : Math.exp(-(eles[j] - eles[i])/tDiv)
            });
        }
    }

    metropolisSolution = metropolisSolution;
  };

  $: initElements(elementCount);

  $: metropolisWalk(elements, t);
</script>

<h1>Anzahl Elemente:</h1>
<input type="number" bind:value={elementCount} />

<br />

<table>
  <tr>
    {#each elements as e, i}
      <th>
        x
        <sub>{i}</sub>
      </th>
    {/each}
  </tr>

  <tr>
    {#each elements as e, i}
      <td>
        <input type="number" class="w-16 h-10 mr-2" bind:value={e} />
      </td>
    {/each}
  </tr>
</table>

<h1 class="mt-2">T=:</h1>
<input class="w-16 h-10" type="number" bind:value={t} />

<h1 class="mt-2">Metropolissolution: </h1>
{#each metropolisSolution as solution}
    <p>x<sub>{solution.from}</sub> &#8594; x<sub>{solution.to}</sub> :{solution.probability}</p>
{/each}
