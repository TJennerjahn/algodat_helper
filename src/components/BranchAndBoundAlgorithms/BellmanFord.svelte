<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";

  let startNode = 6;

  // function to convert ints between 0 and 26 to uppercase letters
  function toUpperCase(n) {
    return String.fromCharCode(n + 64);
  }

  // return a number as a string if it is finite, otherwise return the infinity symbol
  function toStringOrInfinity(n) {
    return n === Infinity ? "\u221E" : n.toString();
  }

  let bellmanFordResult = [];

  // bellman ford algorith
  const bellmanFord = (cyGraph) => {
    bellmanFordResult = [];
    let nodes = cyGraph
      .nodes()
      .toArray()
      .sort((a, b) => a.data("label") - b.data("label"));
    nodes = nodes.map((doc, i) => {
      return {
        distance: i === startNode ? 0 : Number.POSITIVE_INFINITY,
        node: doc,
      };
    });
    let edges = cyGraph.edges().toArray();

    console.log("nodes: ", nodes);

    // for each pair of nodes
    for (let k = 0; k < nodes.length - 1; k++) {
      for (let i = 0; i < nodes.length; i++) {
        let workingEdges = edges.filter(
          (el) => el.data("source") === nodes[i].node.data("id")
        );
        console.log("working edges: ", workingEdges);
        workingEdges.sort((a,b) => nodes.find(d => d.node.data("id") === a.data("target")).node.data("label") - nodes.find(d => d.node.data("id") === b.data("target")).node.data("label"));
        for (let j = 0; j < workingEdges.length; j++) {
          let edge = workingEdges[j];
          console.log("edge: ", edge);
          let node = nodes.find(
            (n) => n.node.data("id") === edge.data("target")
          );
          if (node.distance > nodes[i].distance + edge.data("weight")) {
            node.distance = nodes[i].distance + edge.data("weight");
          }

          bellmanFordResult.push({
            label: `${toUpperCase(nodes[i].node.data("label"))} , ${toUpperCase(
              node.node.data("label")
            )}`,
            nodes: nodes.map((n) => {
              return {
                label: `${toUpperCase(n.node.data("label"))}`,
                distance: toStringOrInfinity(n.distance),
              };
            }),
          });
        }
      }
      bellmanFordResult.push({
        label: "--",
        nodes: nodes.map((n) => {
          return {
            distance: Infinity,
            label: "--",
          };
        }),
      });
    }
  };

  if ($myGraph?.elements().length > 0) {
    bellmanFord($myGraph);
    console.log("bellmanFordResult", bellmanFordResult);
  }
</script>

<h1 class="text-xl text-gray-700">Startnode:</h1>
<input on:change={() => {
    bellmanFord($myGraph);
    console.log("bellmanFordResult", bellmanFordResult);
}} id="input" class="w-full" type="number" bind:value={startNode} />

<table class="w-1/2 text-center">
  <tr>
    <th>Kante</th>
    {#each $myGraph?.nodes() as nodes}
      <th>{`D[${toUpperCase(nodes.data("label"))}]`}</th>
    {/each}
  </tr>

  {#each bellmanFordResult as result}
    <tr>
      <td>{result.label}</td>
      {#each result.nodes as nodes}
        <td>{nodes.distance}</td>
      {/each}
    </tr>
  {/each}
</table>
