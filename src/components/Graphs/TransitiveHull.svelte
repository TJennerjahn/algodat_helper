<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";
  import { nanoid } from "nanoid/non-secure";
  import { tick } from "svelte";

  let warshallSolution;

  // warshall algorithm to find the transitive hull of a given cyGraph
  // @param cyGraph: a Cytoscape graph
  const warshall = async (cyGraph) => {
    let warshallObject = cyGraph.elements().floydWarshall({directed: true});

    let nodes = cyGraph.nodes().toArray();
    let edges = cyGraph.edges().toArray();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        let distance = warshallObject.distance(nodes[i], nodes[j]);
        console.log(
          `${nodes[i].data().label} to ${nodes[j].data().label} = ${distance}`
        );
        if (distance !== Infinity) {
          // check if direct edge already exists
          let directEdge = edges.find(
            (e) =>
              e.data().source === nodes[i].data().id &&
              e.data().target === nodes[j].data().id
          );
          if (!directEdge) {
            // create edge
            cyGraph.add({
              group: "edges",
              data: {
                id: nanoid(),
                source: nodes[i].data().id,
                target: nodes[j].data().id,
              },
              style: {
                "target-arrow-shape": "triangle",
              },
            });
          }
        }
      }
    }
    await tick();
    cyGraph.mount(document.querySelector("#transitiveHull"));
    // console.log(solution);
  };

  if ($myGraph?.elements().length > 0) {
    let graph = $myGraph;
    warshallSolution = warshall(graph);
  }
</script>

<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Transitive Hull</p>
  <div id="transitiveHull" class="cytoscape" />
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }

  #transitiveHull {
    width: 100%;
    height: 600px;
    display: block;
  }
</style>
