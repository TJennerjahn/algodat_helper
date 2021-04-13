<script>
  import Card from "./components/Card.svelte";

  // Search Algorithms
  import Suchverfahren from "./pages/Suchverfahren.svelte";

  // Selforganizing Lists
  import SelforganizingLists from "./pages/SelforganizingLists.svelte";

  // Text Search
  import Textsuche from "./pages/Textsuche.svelte";

  // Sorting Algorithms
  import Sortierverfahren from "./pages/Sortierverfahren.svelte";

  // Auswahlproblem
  import Auswahlproblem from "./pages/Auswahlproblem.svelte";

  // Disorder
  import Disorder from "./pages/Disorder.svelte";

  // Datastructures
  import Trees from "./pages/Trees.svelte";

  // Compression
  import Kompression from "./pages/Kompression.svelte";

  // Hashing
  import Hashing from "./pages/Hashing.svelte";
  import Signatures from "./pages/Signatures.svelte";
</script>

<Card>
  <span slot="title">Trees</span>
  <span slot="content"><Trees /></span>
</Card>

<Card>
  <span slot="title">Suchverfahren</span>
  <span slot="content"><Suchverfahren /></span>
</Card>

<Card>
  <span slot="title">Sortierverfahren</span>
  <span slot="content"><Sortierverfahren /></span>
</Card>

<Card>
  <span slot="title">Textsuche</span>
  <span slot="content"><Textsuche /></span>
</Card>

<Card>
  <span slot="title">Kompression</span>
  <span slot="content"><Kompression /></span>
</Card>

<Card>
  <span slot="title">Auswahlproblem</span>
  <span slot="content"><Auswahlproblem /></span>
</Card>

<Card>
  <span slot="title">Unordnung</span>
  <span slot="content"><Disorder /></span>
</Card>

<Card>
  <span slot="title">Selbstorganisierende Listen</span>
  <span slot="content"><SelforganizingLists /></span>
</Card>

<Card>
  <span slot="title">Hashing</span>
  <span slot="content"><Hashing /></span>
</Card>

<Card>
  <span slot="title">Signatures</span>
  <span slot="content"><Signatures /></span>
</Card>

<div class="pb-2" />

<!-- <h1 class="text-4xl text-red-600">Knuth Morris Pratt Algorithmus</h1> -->

<!-- <KnuthMorrisPratt /> -->

<!-- <BoyerMoore /> -->
<style global>
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;

  :global(body) {
    background: #374151;
  }
</style>
