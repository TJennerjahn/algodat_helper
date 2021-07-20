<script>
  import GeneticAlgorithms from '../components/StochasticOptimizers/GeneticAlgorithms.svelte';
  import AdaptiveWalk_GradientDescent from '../components/StochasticOptimizers/AdaptiveWalk_GradientDescent.svelte';
  import MetropolisWalk from '../components/StochasticOptimizers/MetropolisWalk.svelte';

  let menuItems = [
    {
      title: "Genetische Algorithmen",
      active: false,
    },
    {
      title: "Adaptive Walk / Gradient Descent",
      active: false,
    },
    {
      title: "Metropolis Walk",
      active: true,
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
  <GeneticAlgorithms />
{/if}

{#if menuItems[1].active === true}
  <AdaptiveWalk_GradientDescent />
{/if}

{#if menuItems[2].active === true}
  <MetropolisWalk />
{/if}