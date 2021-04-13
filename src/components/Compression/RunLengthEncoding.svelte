<script>
  let input = "TTTTEESSSE";
  let output = "";

  let transform = function (value) {
    let result = "";
    let counter = 0;
    for (var i = 0; i < value.length; i++) {
      counter++;
      if (i < value.length - 1) {
        if (value[i] !== value[i + 1]) {
          if (counter === 1) {
            result += `${value[i]}`;
          } else if (counter > 1) {
            result += `${counter}${value[i]}`;
          }
          counter = 0;
        }
      } else {
        if (value[i] === value[i - 1]) {
          result += `${counter}${value[i]}`;
        } else {
          result += `${value[i]}`;
        }
      }
    }
    output = result;
  };

  $: transform(input);
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />

<h1 class="text-3xl text-gray-700">Output:</h1>
<p>{output}</p>
