<script>
  import * as _ from "lodash";
  let startpoints = 160;

  let newObject = {
    name: "",
    cost: 0,
    gain: 0,
    forceUse: 0,
  };

  let objects = [
    {
      name: "Pavillion",
      cost: 50,
      gain: 10,
      forceUse: 0,
    },
    {
      name: "Getraenkefass",
      cost: 60,
      gain: 5,
      forceUse: 0,
    },
    {
      name: "Outdoor-Musikanlage",
      cost: 20,
      gain: 15,
      forceUse: 0,
    },
    {
      name: "Zelt",
      cost: 30,
      gain: 20,
      forceUse: 0,
    },
    {
      name: "aufblasbares Planschbecken",
      cost: 50,
      gain: 15,
      forceUse: 0,
    },
  ];

  // let objects = [
  //   {
  //     name: "Lakritze",
  //     cost: 220,
  //     gain: 100,
  //     forceUse: 0,
  //   },
  //   {
  //     name: "Esspapier",
  //     cost: 80,
  //     gain: 10,
  //     forceUse: 0,
  //   },
  //   {
  //     name: "Gummibaerchen",
  //     cost: 140,
  //     gain: 70,
  //     forceUse: 0,
  //   },
  //   {
  //     name: "Schokolade",
  //     cost: 90,
  //     gain: 80,
  //     forceUse: 0,
  //   },
  //   {
  //     name: "Apfelringe",
  //     cost: 100,
  //     gain: 100,
  //     forceUse: 0,
  //   },
  // ];

  let currentFracResult;

  const fractionalProblem = (
    itemList,
    points,
    allowFractions,
    invertResult = false
  ) => {
    let forceItems = itemList.filter((el) => el.forceUse === 1);
    itemList = itemList.filter((el) => el.forceUse === 0);

    itemList = itemList.sort((a, b) => {
      return b.gain / b.cost - a.gain / a.cost;
    });

    let result = {
      tsum: 0,
      psum: 0,
      t: [],
      p: [],
    };

    for (let i = 0; i < forceItems.length; i++) {
      if (result.tsum + forceItems[i].cost <= points) {
        result.t = [...result.t, forceItems[i].cost.toString()];
        result.p = [...result.p, forceItems[i].gain.toString()];
        result.psum += forceItems[i].gain;
        result.tsum += forceItems[i].cost;
      } else if (result.tsum < points && allowFractions === true) {
        result.t = [...result.t, (points - result.tsum).toString()];
        result.p = [
          ...result.p,
          `${points - result.tsum} / ${forceItems[i].cost} * ${
            forceItems[i].gain
          }`,
        ];
        result.psum +=
          ((points - result.tsum) / forceItems[i].cost) * forceItems[i].gain;
        result.tsum += points - result.tsum;
      }
    }

    for (let i = 0; i < itemList.length; i++) {
      if (result.tsum + itemList[i].cost <= points) {
        result.t = [...result.t, itemList[i].cost.toString()];
        result.p = [...result.p, itemList[i].gain.toString()];
        result.psum += itemList[i].gain;
        result.tsum += itemList[i].cost;
      } else if (result.tsum < points && allowFractions === true) {
        result.t = [...result.t, (points - result.tsum).toString()];
        result.p = [
          ...result.p,
          `${points - result.tsum} / ${itemList[i].cost} * ${itemList[i].gain}`,
        ];
        result.psum +=
          ((points - result.tsum) / itemList[i].cost) * itemList[i].gain;
        result.tsum += points - result.tsum;
      }
    }

    if (invertResult === true) {
      result.tsum *= -1;
      result.psum *= -1;
    }
    return result;
  };

  let knapSack01ResultList = [];
  const knapSack01 = (itemList, points) => {
    knapSack01ResultList = [];
    let stack = [];
    let currentConfig = [];
    let b = 0;
    currentConfig = _.cloneDeep(itemList);
    stack.push(currentConfig);

    while (stack.length > 0) {
      let A = stack[0];
      let minimalSearchSpace = false;
      // console.log(fractionalProblem(A.filter(el => el.forceUse === 1), points, false).psum);
      // console.log(A.filter(el => el.forceUse === 0).reduce((a,b) => a + b.cost, 0));
      // console.log(points - A.filter(el => el.forceUse === 1).reduce((a,b) => a + b.cost, 0) < Math.min(...(A.filter(el => el.forceUse === 0).map(doc => doc.cost))));
      if (
        points -
          A.filter((el) => el.forceUse === 1).reduce((a, b) => a + b.cost, 0) <
        Math.min(...A.filter((el) => el.forceUse === 0).map((doc) => doc.cost))
      ) {
        minimalSearchSpace = true;
        console.log("minimalSearchSpace = true", A);
      }
      let fracResult = fractionalProblem(A, points, !minimalSearchSpace, true);
      if (fracResult.tsum * -1 < points) {
        minimalSearchSpace = true;
      }

      knapSack01ResultList = [
        ...knapSack01ResultList,
        {
          b: _.cloneDeep(b),
          gTop: _.cloneDeep(fracResult),
          stack: _.cloneDeep(stack),
        },
      ];
      stack.shift();
      if (fracResult.psum < b) {
        if (
          A.filter((el) => el.forceUse === 0).length <= 1 ||
          minimalSearchSpace === true
        ) {
          b = fracResult.psum;
          knapSack01ResultList[knapSack01ResultList.length - 1].b = b;
        } else {
          let splitA = _.cloneDeep(A);
          let splitB = _.cloneDeep(A);

          // let availablePoints =
          //   A.filter((el) => el.forceUse === 1).length > 0
          //     ? points -
          //       A.filter((el) => el.forceUse === 1).reduce((a, b) => a + b.cost)
          //     : points;
          // let viableItems = A.filter((el) => el.forceUse === 0).filter(
          //   (el) => el.cost <= availablePoints
          // );
          // if (viableItems.length === 1) {
          //   for (let i = 0; i < A.length; i++) {
          //     if (A[i].forceUse === 0) {
          //       if (A[i].name === viableItems[0].name) {
          //         splitA[i].forceUse = 1;
          //       } else {
          //         splitA[i].forceUse = -1;
          //       }
          //     }
          //   }

          //   stack.unshift(splitA);
          // } else {
            for (let i = 0; i < A.length; i++) {
              if (A[i].forceUse === 0) {
                // if (
                //   A.filter((el) => el.forceUse === 1).reduce(
                //     (a, b) => a + b.cost,
                //     0
                //   ) +
                //     A[i].cost <=
                //   points
                // ) {
                  splitA[i].forceUse = 1;
                  splitB[i].forceUse = -1;
                  break;
                // } else {
                  // splitA[i].forceUse = -1;
                  // splitB[i].forceUse = -1;
                // }
              }
            }

            if (splitB.filter((el) => el.forceUse === 0).length > 0) {
              stack.unshift(splitB);
            }
            if (
              
              splitA.filter((el) => el.forceUse === 0).length > 0
            ) {
              stack.unshift(splitA);
            }
          // }
        }
      }
    }

    console.log("KnapSack01ResultList", knapSack01ResultList);
  };
</script>

<h1 class="text-3xl text-gray-700 mt-2 inline">Ausgangspunkte:</h1>
<input class="text-xl" type="number" bind:value={startpoints} />

<table class="w-1/2 text-left">
  <tr>
    <th>Objekt</th>
    <th>Kosten (ti)</th>
    <th>Nutzen (pi)</th>
    <th>pi / ti</th>
    <th>Force Use</th>
    <th />
  </tr>

  {#each objects as object}
    <tr>
      <td>{object.name}</td>
      <td>{object.cost}</td>
      <td>{object.gain}</td>
      <td>{(object.gain / object.cost).toFixed(3)}</td>
      <td><input type="number" bind:value={object.forceUse} /></td>
      <td>
        <button
          on:click={() => {
            objects = objects.filter((el) => el !== object);
          }}
          class="bg-red-600 text-red-50 px-1 py-1 rounded-md"
        >
          Delete
        </button>
      </td>
    </tr>
  {/each}

  <tr>
    <td>
      <input type="text" bind:value={newObject.name} />
    </td>
    <td><input type="number" bind:value={newObject.cost} /></td>
    <td><input type="number" bind:value={newObject.gain} /></td>
    <td>
      <button
        on:click={() => {
          objects = [...objects, _.cloneDeep(newObject)];
        }}
        class="bg-gray-700 text-white px-1 py-1 rounded-md"
      >
        Hinzufuegen
      </button>
    </td>
  </tr>
</table>

<button
  on:click={() => {
    currentFracResult = fractionalProblem(objects, startpoints, true);
    knapSack01(objects, startpoints);
  }}
  class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
>
  Berechnen
</button>

{#if currentFracResult !== undefined}
  <h1 class="text-3xl text-gray-700 mt-2">Fraktionales Rucksackproblem:</h1>
  <span>t:</span>
  {#each currentFracResult.t as tEntry, index}
    <span>{tEntry}</span>
    {#if index < currentFracResult.t.length - 1}
      <span>+</span>
    {/if}
  {/each}
  <span>= {currentFracResult.tsum.toFixed(3)}</span>

  <br />

  <span>p:</span>
  {#each currentFracResult.p as pEntry, index}
    <span>{pEntry}</span>
    {#if index < currentFracResult.p.length - 1}
      <span>+</span>
    {/if}
  {/each}

  <span>{` = `} {currentFracResult.psum.toFixed(3)}</span>

  <h1 class="text-3xl text-gray-700 mt-2">0/1 Rucksackproblem:</h1>

  <table class="w-full text-left">
    <tr>
      <th>b</th>
      <th>g(TOP(S))</th>
      <!-- <th>Available Points</th> -->
      <!-- <th>Min Available Item</th> -->
      <th>STACK</th>
    </tr>
    {#each knapSack01ResultList as resultEntry}
      <tr>
        <td>{resultEntry.b}</td>
        <td>
          {`${resultEntry.gTop.psum} = -(${resultEntry.gTop.p.join(" + ")})`}
        </td>
        <!-- <td>{startpoints - fractionalProblem(resultEntry.stack[0], startpoints, false, false).tsum}</td> -->
        <!----
        <td>
          {Math.min(
            ...resultEntry.stack[0]
              .filter((el) => el.forceUse === 0)
              .map((doc) => doc.cost)
          )}
        </td>
        -->
        <td class="text-right">
          {resultEntry.stack
            .map((doc) =>
              doc
                .map((a) => a.forceUse)
                .toString()
                .replaceAll(",", "")
            )
            .join(" | ")
            .replaceAll("0", "*")
            .replaceAll("-1", "0")}
        </td>
      </tr>
    {/each}
  </table>
{/if}
