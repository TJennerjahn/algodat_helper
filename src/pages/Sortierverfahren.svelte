<script>
  import BubbleSort from "../components/SortAlgorithms/BubbleSort.svelte";
  import DistributionSort from "../components/SortAlgorithms/DistributionSort.svelte";
  import HeapSort from "../components/SortAlgorithms/HeapSort.svelte";
  import InsertionSort from "../components/SortAlgorithms/InsertionSort.svelte";
  import MergeSort from "../components/SortAlgorithms/MergeSort.svelte";
  import QuickSort from "../components/SortAlgorithms/QuickSort.svelte";
  import SelectionSort from "../components/SortAlgorithms/SelectionSort.svelte";

  let menuItems = [
    {
      title: "Bubblesort",
      active: true,
    },
    {
      title: "Distributionsort",
      active: false,
    },
    {
      title: "Heapsort",
      active: false,
    },
    {
      title: "Insertionsort",
      active: false,
    },
    {
      title: "Mergesort",
      active: false,
    },
    {
      title: "Quicksort",
      active: false,
    },
    {
      title: "Selectionsort",
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
  <BubbleSort />
{/if}

{#if menuItems[1].active === true}
  <DistributionSort />
{/if}

{#if menuItems[2].active === true}
  <HeapSort />
{/if}

{#if menuItems[3].active === true}
  <InsertionSort />
{/if}

{#if menuItems[4].active === true}
  <MergeSort />
{/if}

{#if menuItems[5].active === true}
  <QuickSort />
{/if}

{#if menuItems[6].active === true}
  <SelectionSort />
{/if}
