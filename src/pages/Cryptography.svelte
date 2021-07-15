<script>
  import Euklid from '../components/Cryptography/Euklid.svelte';
  import Pollard_Rho from "../components/Cryptography/Pollard_Rho.svelte";
  import RSA from "../components/Cryptography/RSA.svelte";

  let menuItems = [
    {
      title: "Euklid",
      active: true,
    },
    {
      title: "Pollards Rho",
      active: false,
    },
    {
      title: "RSA Kernalgorithmus",
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
  <Euklid/>
{/if}

{#if menuItems[1].active === true}
  <Pollard_Rho />
{/if}

{#if menuItems[2].active === true}
  <RSA />
{/if}