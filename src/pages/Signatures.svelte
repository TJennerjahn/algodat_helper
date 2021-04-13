<script>
  import { create, all } from "mathjs";
  import * as _ from "lodash";
  import { document } from "lodash/_freeGlobal";
  const config = {};
  const math = create(all, config);

  let inputFunction = "";
  let input = "";

  const parser = math.parser();

  let evaluate = function (value) {
    parser.evaluate(inputFunction);
    let result = parser.evaluate(value);
    console.log(result);
    document.getElementById("input").focus();
    input = "";
  };
</script>

<h1 class="text-3xl text-gray-700">Function</h1>
<input class="w-1/2" type="text" bind:value={inputFunction} />

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={evaluate(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md mt-2">Evaluate</button
>
