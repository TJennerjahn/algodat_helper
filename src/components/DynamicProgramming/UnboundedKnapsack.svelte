<script>
  import * as _ from "lodash";
  let objectList = [
    {
      name: "A",
      value: 4,
      cost: 3,
    },
    {
      name: "B",
      value: 10,
      cost: 6,
    },
    {
      name: "C",
      value: 1,
      cost: 1,
    },
  ];

  let objectTemplate = {
    name: "",
    value: 0,
    cost: 0,
  };

  let capacity = 10;
  let jumpSize = 1;

  let unboundedKnapsackSolution = [];

  const unboundedKnapsack = (objectList) => {
    unboundedKnapsackSolution = [];

    // initialize array best_wert with capacity elements at 0
    let best_wert = Array.apply(null, Array(capacity + 1)).map(
      Number.prototype.valueOf,
      0
    );
    let best_obj = Array.apply(null, Array(capacity + 1)).map((doc) => "-");

    for (let j = 0; j < objectList.length; j++) {
      for (let i = 1; i <= capacity; i++) {
        if (i >= objectList[j].cost) {
          if (
            best_wert[i] <
            best_wert[i - objectList[j].cost] + objectList[j].value
          ) {
            best_wert[i] =
              best_wert[i - objectList[j].cost] + objectList[j].value;
            best_obj[i] = objectList[j].name;
          }
        }
      }

      let best_obj_result = _.cloneDeep(best_obj.slice(1));

      let best_wert_result = _.cloneDeep(best_wert.slice(1));

      unboundedKnapsackSolution.push({
        best_wert: best_wert_result,
        best_obj: best_obj_result,
      });
    }

    unboundedKnapsackSolution = unboundedKnapsackSolution;
    console.log(unboundedKnapsackSolution);
  };

  $: unboundedKnapsack(objectList);
</script>

<h1 class="text-xl text-gray-700">Kapazität:</h1>
<input type="number" class="w-1/3" bind:value={capacity} />

<h1 class="text-xl text-gray-700">Sprunggröße:</h1>
<input type="number" class="w-1/3" bind:value={jumpSize} />

<table class="w-1/3 text-center">
  <tr>
    <th>Bezeichung</th>
    <th>Wert</th>
    <th>Kosten</th>
    <th />
  </tr>

  {#each objectList as object}
    <tr>
      <td>
        <input type="text" bind:value={object.name} />
      </td>
      <td>
        <input type="number" bind:value={object.value} />
      </td>
      <td>
        <input type="number" bind:value={object.cost} />
      </td>
      <td>
        <!-- Grey button that adds objectTemplate to objectList -->
        <button
          class="btn btn-default bg-red-500 btn-sm text-white p-2 rounded-md"
          on:click={() => {
            objectList.splice(objectList.indexOf(object), 1);
            objectList = objectList;
          }}
        >
          Loeschen
        </button>
      </td>
    </tr>
  {/each}

  <tr>
    <td>
      <input type="text" bind:value={objectTemplate.name} />
    </td>
    <td>
      <input type="number" bind:value={objectTemplate.value} />
    </td>
    <td>
      <input type="number" bind:value={objectTemplate.cost} />
    </td>
    <td>
      <!-- Grey button that adds objectTemplate to objectList -->
      <button
        class="btn btn-default btn-sm p-2 rounded-md"
        on:click={() => {
          objectList = [...objectList, objectTemplate];
        }}
      >
        Hinzufügen
      </button>
    </td>
  </tr>
</table>

{#each unboundedKnapsackSolution as solution, j}
  <p class="mt-3">j = {j + 1}</p>
  <div class="overflow-x-auto">
    <table class="w-full text-center">
      <tr>
        <th>i</th>
        {#each solution.best_wert as best_wert, i}
          {#if (i + 1) % jumpSize == 0}
            <th class="px-2">{i + 1}</th>
          {/if}
        {/each}
      </tr>
      <tr>
        <td>best_wert[i]</td>
        {#each solution.best_wert as best_wert, i}
          {#if (i + 1) % jumpSize == 0}
            <td>{best_wert}</td>
          {/if}
        {/each}
      </tr>

      <tr>
        <td>best_obj[i]</td>
        {#each solution.best_obj as best_obj, i}
          {#if (i + 1) % jumpSize == 0}
            <td>{best_obj}</td>
          {/if}
        {/each}
      </tr>
    </table>
  </div>
{/each}
