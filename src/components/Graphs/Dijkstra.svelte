<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";

  let dijkstraResult;
  let startNode = 6;

  const dijsktra = (cyGraph) => {
    console.log("Dijkstra is running...");
    let result = [];
    let nodes = cyGraph.nodes().toArray();
    let edges = cyGraph.edges().toArray();
    nodes = nodes.map((doc, i) => {
      const d = i === startNode ? 0 : 1000;
      return {
        distance: d,
        node: doc,
        visited: false,
      };
    });

    console.log("nodes", nodes);

    while (nodes.filter((el) => el.visited === false).length > 0) {
      let workingNodes = nodes.filter((el) => el.visited === false);
      workingNodes.sort((a, b) => a.distance - b.distance);
      let workingNode = workingNodes[0];
      workingNode.visited = true;

      result.push({
        list: nodes.map((doc) => {
          return {
            distance: doc.distance,
            label: doc.node.data("label"),
          };
        }),
        smallest: workingNode.node.data("label"),
      });

      let workingEdges = edges.filter(
        (el) => el.data("source") === workingNode.node.data("id")
      );
      for (let i = 0; i < workingEdges.length; i++) {
        let tempNode = nodes.find(
          (el) => el.node.data("id") === workingEdges[i].data("target")
        );
        if (
          workingNode.distance + parseInt(workingEdges[i].data("weight")) <
          tempNode.distance
        ) {
          tempNode.distance =
            workingNode.distance + parseInt(workingEdges[i].data("weight"));
        }
      }
    }

    result.push({
        list: nodes.map((doc) => {
          return {
            distance: doc.distance,
            label: doc.node.data("label"),
          };
        }),
        smallest: "-",
      });

    return result;
    // console.log('result', result);
  };

  if ($myGraph.elements().length > 0) {
    dijkstraResult = dijsktra($myGraph);
    console.log("Dijkstra", dijkstraResult);
  }
</script>


<h1 class="text-xl text-gray-700">Startnode:</h1>
<input on:change={() => {
    dijkstraResult = dijsktra($myGraph);
    console.log("Dijkstra", dijkstraResult);
}} id="input" class="w-full" type="number" bind:value={startNode} />

{#if dijkstraResult !== undefined}
  <table class="w-1/2 text-center">
    <tr>
      {#each dijkstraResult[0].list as head}
        <th>{head.label}</th>
      {/each}
      <th></th>
    </tr>

    {#each dijkstraResult as row, index}
      <tr>
        {#each dijkstraResult[index].list as element}
          <td>{element.distance}</td>
        {/each}
        <td>{dijkstraResult[index].smallest}</td>
      </tr>
    {/each}
  </table>
{/if}
