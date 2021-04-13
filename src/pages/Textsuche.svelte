<script>
  import KnuthMorrisPratt from "../components/TextSearch/KnuthMorrisPratt.svelte";
  import BoyerMoore from "../components/TextSearch/BoyerMoore.svelte";
  import SuffixTree from "../components/TextSearch/SuffixTree.svelte";
  import PrefixTree from "../components/TextSearch/PrefixTree.svelte";

  let menuItems = [
    {
      title: "Knuth-Morris-Pratt",
      active: true,
    },
    {
      title: "Boyer-Moore",
      active: false,
    },
    {
      title: "Suffix Trees",
      active: false,
    },
    {
      title: "Prefix Trees",
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
  <KnuthMorrisPratt />
{/if}

{#if menuItems[1].active === true}
  <BoyerMoore />
{/if}

{#if menuItems[2].active === true}
  <SuffixTree />
{/if}

{#if menuItems[3].active === true}
  <PrefixTree />
{/if}
