<script>
    import KnapSackProblem from "../components/BranchAndBoundAlgorithms/KnapSackProblem.svelte";
    import TravelingSalesmanProblem from '../components/BranchAndBoundAlgorithms/TravelingSalesmanProblem.svelte';
    import BellmanFord from '../components/BranchAndBoundAlgorithms/BellmanFord.svelte';

    let menuItems = [
      {
        title: "Rucksackproblem",
        active: true,
      },
      {
        title: "Rundreise",
        active: false
      },
      {
        title: "Bellman Ford",
        active: false
      }
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
    <KnapSackProblem />
  {/if}
  
  {#if menuItems[1].active === true}
    <TravelingSalesmanProblem />
  {/if}

  {#if menuItems[2].active === true}
    <BellmanFord />
  {/if}