<script>
  import * as _ from "lodash";
  import { tick } from "svelte";
  import { myGraph } from "../../stores/graphStore";
  import {
    findMaxAugmentingPath,
    createResidualGraph,
  } from "../../utils/cytoscapehelper";

  let maxAugmentingPath = {};

  (async () => {
    if ($myGraph?.elements().length > 0) {
      let residualGraph = createResidualGraph($myGraph);
      await tick();
      residualGraph.mount(document.querySelector(`#graphbuilder`));
      await tick();
      residualGraph.center();
      residualGraph.fit();

      const sourceId = residualGraph.nodes().find(n => n.data("isSource") === true).data('id');
      const sinkId = residualGraph.nodes().find(n => n.data("isSink") === true).data('id');

      maxAugmentingPath = findMaxAugmentingPath(residualGraph, sourceId, sinkId);

      console.log(maxAugmentingPath);
    }
  })();
</script>

<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Residual Graph</p>
  <div id="graphbuilder" class="cytoscape" />
  <h1 class="mt-2">Max Augmenting Path: </h1>
  <p>{maxAugmentingPath.path?.map(x => x.source().data("label")).concat(["T"]).join(" -> ")}</p>

  <h1 class="mt-2">Max additional Flow</h1>
  <p>{maxAugmentingPath.flow}</p>
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 450px;
    display: block;
  }

  /* #graphbuilder {
    width: 100%;
    height: 600px;
    display: block;
  } */
</style>
