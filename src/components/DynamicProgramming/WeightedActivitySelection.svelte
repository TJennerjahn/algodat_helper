<script>
  import * as _ from "lodash";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

  dayjs.extend(customParseFormat);
  dayjs.extend(isSameOrAfter);

  let activities = [];
  let newActivity = {
    name: "",
    start: "",
    end: "",
    weight: 1,
  };

  let selectedActivities = [];

  const selection = (list) => {
    let workingActivities = _.cloneDeep(list);

    const p = (k) => {
      let counter = 0;
      for (let i = 1; i < k; i++) {
        if (
          workingActivities[k].start.isSameOrAfter(workingActivities[i].end)
        ) {
          counter++;
        }
      }
      return counter;
    };

    workingActivities.sort((a, b) => (a.end.isAfter(b.end) ? 1 : -1));

    workingActivities.unshift({
      name: "empty",
      weight: 0,
      p: 0,
      solution: 0,
      solutionArray: [],
    });

    for (let i = 1; i < workingActivities.length; i++) {
      workingActivities[i].p = p(i);
      let solutionSpace = [];
      solutionSpace.push(
        workingActivities[i].weight + workingActivities[p(i)].solution
      );
      solutionSpace.push(workingActivities[i - 1].solution);
      workingActivities[i].solution = _.max(solutionSpace);

      let maxIndex = solutionSpace.findIndex(
        (x) => x === workingActivities[i].solution
      );
      if (solutionSpace[0] === solutionSpace[1]) {
        maxIndex = 1;
      }

      workingActivities[i].maxIndex = maxIndex;

      // backtracing
      let solutionArray = [];
      let k = i;
      while (k > 0) {
        if (workingActivities[k].maxIndex === 0) {
          solutionArray.push(workingActivities[k].name);
          k = p(k);
        } else {
          k--;
        }
      }

      workingActivities[i].solutionArray = solutionArray.reverse();
    }

    console.log(workingActivities);
    return workingActivities;
  };

  $: selectedActivities = selection(activities);
</script>

<table>
  <tr>
    <th>Activity</th>
    <th>Start</th>
    <th>Ende</th>
    <th>Gewicht</th>
    <th />
  </tr>

  {#each activities as activity, i}
    <tr class="text-center">
      <td>{activity.name}</td>
      <td>{dayjs(activity.start).format("HH:mm")}</td>
      <td>{dayjs(activity.end).format("HH:mm")}</td>
      <td>{activity.weight}</td>
      <td>
        <button
          class="bg-red-500 text-white rounded-md p-2"
          on:click={() => {
            activities.splice(i, 1);
            activities = activities;
          }}
        >
          Löschen
        </button>
      </td>
    </tr>
  {/each}

  <tr>
    <td>
      <input type="text" bind:value={newActivity.name} />
    </td>
    <td>
      <input type="text" bind:value={newActivity.start} />
    </td>
    <td>
      <input type="text" bind:value={newActivity.end} />
    </td>

    <td>
      <input type="number" bind:value={newActivity.weight} />
    </td>

    <td>
      <button
        class="bg-gray-700 text-white px-1 p-2 rounded-md my-2"
        on:click={() => {
          activities.push({
            name: newActivity.name,
            start: dayjs(newActivity.start, ["HH:mm", "HH"]),
            end: dayjs(newActivity.end, ["HH:mm", "HH"]),
            weight: newActivity.weight,
          });
          activities = activities;
          console.log(activities);
        }}
      >
        Hinzufügen
      </button>
    </td>
  </tr>
</table>

<h1 class="mt-2">Optimale Selection</h1>
<p>{selectedActivities[selectedActivities.length - 1]?.solutionArray.join(", ")}</p>
<p>Gewicht:{selectedActivities[selectedActivities.length - 1]?.solution}</p>