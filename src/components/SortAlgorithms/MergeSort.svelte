<script>
  // let input = "47,9,22,45,42,44,22";
  let input = "n,i,s,r,j,e,q,p,o,g,h,t,f,l,m,k";
  let list = [];
  let successrun = [];

  function getShuffledArray(arraySize) {
    const array = new Array(arraySize);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * 100;
    }
    let ratio = Math.max.apply(Math, array) / 100;
    for (var i = 0; i < array.length; i++) {
      array[i] = parseInt(array[i] / ratio).toString();
    }
    return array.join(",");
  }

  function transformList(transform) {
    successrun = [];
    list = transform.split(","); //.map((doc) => parseInt(doc));
    console.log(list);
    // mergesortrec(list, 0, list.length - 1);
    mergesortnonrec(list);
    console.log(list);
    console.log(successrun);
  }

  function mergesortrec(L, l, r) {
    if (r <= l) {
      return;
    } else {
      let m = Math.floor((l + r + 1) / 2);
      mergesortrec(L, l, m - 1);
      successrun.push([...L]);
      mergesortrec(L, m, r);
      successrun.push([...L]);
      merge(L, l, m, r);
      successrun.push([...L]);
    }
  }

  function mergesortnonrec(L) {
    let n = L.length;
    for (var k = 2; k < n; k *= 2) {
      for (var i = 0; i + k <= n; i += k) {
        let testString = "|";
        for (var j = 0; j <= i; j++) {
          testString += ` ${L[j]}`;
        }
        testString += "|";
        console.log(testString);
        merge(L, i, i + k / 2, Math.min(i + k - 1, n - 1));
      }
    }
    merge(L, 0, k / 2, n - 1);
    merge(L, 0, k / 2, n - 1);
  }

  function merge(L, l, m, r) {
    let j = l;
    let k = m;
    let B = new Array(L);
    for (var i = 0; i <= r - l; i++) {
      if (k > r || (j < m && L[j] <= L[k])) {
        B[i] = L[j];
        j = j + 1;
      } else {
        B[i] = L[k];
        k = k + 1;
      }
    }
    for (var i = 0; i <= r - l; i++) {
      L[l + i] = B[i];
    }
  }
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input class="w-1/2" type="text" bind:value={input} />
<button
  type="button"
  on:click={transformList(input)}
  class="bg-gray-600 py-2 px-4 text-gray-100 rounded-md block mt-2"
  >Sortieren</button
>
