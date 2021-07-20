<script>
    import * as _ from "lodash";
  
    let p = 0.75;
    let k = 4;
    let swapVector = "-*-**--*-";
  
    $: swapArray = swapVector.split("");
  
    let x1 = "3,9,7,9,7,1,3,2,8";
    let x2 = "3,4,2,1,7,6,8,1,5";
  
    // let x1 = "1,2,3,4,5,6,7,8,9";
    // let x2 = "9,8,7,6,5,4,3,2,1";
  
    $: x1Array = x1.split(",").map((doc) => parseInt(doc));
  
    $: x2Array = x2.split(",").map((doc) => parseInt(doc));
  
    const round = (number) => {
      return (Math.round(number * 100) / 100).toFixed(2);
    };
  </script>
  
  <h1 class="text-3xl text-gray-700 mt-2">X1 Input:</h1>
  <input class="text-xl" type="text" bind:value={x1} />
  
  <br />
  
  <h1 class="text-3xl text-gray-700 mt-2">X2 Input:</h1>
  <input class="text-xl" type="text" bind:value={x2} />
  
  <br />
  
  <h1 class="text-3xl text-gray-700 mt-2 inline">1-Punkt Crossover mit k=:</h1>
  <input class="text-xl" type="number" bind:value={k} />
  <br />
  
  <h1 class="text-xl text-gray-700 mt-2 inline">x1=</h1>
  <p class="inline text-gray-700 ml-2">
    {x1Array.slice(0, k).concat(x2Array.slice(k)).toString()}
  </p>
  <br />
  
  <h1 class="text-xl text-gray-700 mt-2 inline">x2=</h1>
  <p class="inline text-gray-700 ml-2">
    {x2Array.slice(0, k).concat(x1Array.slice(k)).toString()}
  </p>
  <br />
  
  <h1 class="text-3xl text-gray-700 mt-2 inline">
    Uniform Crossover mit dem Tauschvektor:
  </h1>
  <input class="text-xl" type="text" bind:value={swapVector} />
  <br />
  
  <h1 class="text-xl text-gray-700 mt-2 inline">x1=</h1>
  <p class="inline text-gray-700 ml-2">
    {x1Array.map((doc, i) => {return (swapArray[i] === "-" ? doc : x2Array[i])}).toString()}
  </p>
  <br />
  
  <h1 class="text-xl text-gray-700 mt-2 inline">x2=</h1>
  <p class="inline text-gray-700 ml-2">
      {x2Array.map((doc, i) => {return (swapArray[i] === "-" ? doc : x1Array[i])}).toString()}
  </p>
  <br />
  
  <h1 class="text-3xl text-gray-700 mt-2 inline">
    Elementweise Konvexe Kombination mit p=:
  </h1>
  <input class="text-xl" type="number" bind:value={p} />
  
  <br />
  
  <h1 class="text-xl text-gray-700 mt-2 inline">x1=</h1>
  <p class="inline text-gray-700 ml-2">
    {x1Array
      .map((doc, i) => {
        return round(p * x1Array[i] + (1 - p) * x2Array[i]);
      })
      .toString()}
  </p>
  
  <br />
  
  <h1 class="text-xl text-gray-700 mt-2 inline">x2=</h1>
  <p class="inline text-gray-700 ml-2">
    {x1Array
      .map((doc, i) => {
        return round(p * x2Array[i] + (1 - p) * x1Array[i]);
      })
      .toString()}
  </p>
  