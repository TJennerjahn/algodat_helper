<script>
  import BurrowsWheelerTransformation from "../components/Compression/BurrowsWheelerTransformation.svelte";
  import HuffmanEncoding from "../components/Compression/HuffmanEncoding.svelte";
  import MoveToFrontEncoding from "../components/Compression/MoveToFrontEncoding.svelte";
  import RunLengthEncoding from "../components/Compression/RunLengthEncoding.svelte";

  let menuItems = [
    {
      title: "Burrows-Wheeler Transformation",
      active: true,
    },
    {
      title: "Huffman Encoding",
      active: false,
    },
    {
      title: "MTF Encoding",
      active: false,
    },
    {
      title: "Lauflängenkodierung",
      active: false,
    },
  ];
</script>

<div class="flex">
  {#each menuItems as item}
    <button
      on:click={() => {
        for (var i = 0; i < menuItems.length; i++) {
          menuItems[i].active = false;
        }
        item.active = true;
      }}
      class="p-2 mx-1 underline {item.active === true
        ? `text-red-500 font-bold`
        : `text-gray-600`}"
    >
      {item.title}
    </button>
  {/each}
</div>

{#if menuItems[0].active === true}
  <BurrowsWheelerTransformation />
{/if}

{#if menuItems[1].active === true}
  <HuffmanEncoding />
{/if}

{#if menuItems[2].active === true}
  <MoveToFrontEncoding />
{/if}

{#if menuItems[3].active === true}
  <RunLengthEncoding />
{/if}
