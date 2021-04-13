<script>
  let input = "3,5,8,2,1,7,9,4";
  let list = [];

  let inversions = [];
  let invCount = 0;

  let runs = [];
  let runCount = 0;
  let las = 0;
  let rem = 0;

  function transformList(transform) {
    list = transform.split(",").map((doc) => parseInt(doc));
  }

  $: transformList(input);

  function findInversions(l) {
    inversions = [];
    invCount = 0;
    for (var i = 0; i < l.length; i++) {
      console.log("Test");
      let successString = "";
      successString += `(${l[i]}:`;
      let count = 0;
      for (var j = i + 1; j < l.length; j++) {
        if (l[j] < l[i]) {
          count++;
          successString += `${l[j]}/`;
        }
      }
      successString = successString.slice(0, -1);
      successString += `)`;
      if (count > 0) {
        inversions.push(successString);
        invCount += count;
      }
    }
    inversions = inversions;
  }

  function findRuns(l) {
    runs = [];
    runCount = 0;
    las = 0;
    rem = 0;

    let i = 0;
    while (i < l.length) {
      runCount++;
      let currentRun = 0;
      let runString = ``;
      for (var j = i; j < l.length; j++) {
        runString += `${l[j]} - `;
        if (l[j] > l[j + 1]) {
          currentRun = j - i + 1;
          break;
        }
      }
      runString = runString.slice(0, -3);
      runs.push(runString);
      if (currentRun > las) {
        las = currentRun;
      }
      i += j - i + 1;
    }

    rem = l.length - las;
    runs = runs;
  }

  $: findInversions(list);
  $: findRuns(list);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700 pt-4">Inversionen:</h1>
<div>
  {#each inversions as run}
    <p>{run}</p>
  {/each}

  <p>{invCount} Inversionen gefunden!</p>
</div>

<h1 class="text-3xl text-gray-700 pt-4">Runs:</h1>
<div>
  {#each runs as run}
    <p>{run}</p>
  {/each}

  <p>runs={runCount} las={las} rem={rem}</p>
</div>
