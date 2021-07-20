<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";

  let warshallResult = [];

  const warshall = (cyGraph) => {
    warshallResult = [];
    let matrix = [];

    let nodes = cyGraph.nodes();
    let edges = cyGraph.edges();

    for (let i = 0; i < nodes.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          let connectedEdges = edges.filter(
            (e) => e.source() === nodes[i] && e.target() === nodes[j]
          );
          if (connectedEdges.length === 0) {
            matrix[i][j] = Infinity;
          } else {
            matrix[i][j] = connectedEdges[0].data("weight");
          }
        }
      }
    }

    console.table(matrix);

    warshallResult.push(_.cloneDeep(matrix));
    for (let j = 0; j < nodes.length; j++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let k = 0; k < nodes.length; k++) {
          matrix[i][k] = Math.min(matrix[i][k], matrix[i][j] + matrix[j][k]);
        }
      }
      warshallResult.push(_.cloneDeep(matrix));
    }

    warshallResult = warshallResult;
  };

  if ($myGraph?.elements().length > 0) {
    warshall($myGraph);
    console.log("warshallResult", warshallResult);
  }
</script>

<div class="flex flex-row flex-wrap gap-4 mt-4">
  {#each warshallResult as result}
    <div class="border-2 border-gray-600 rounded-md">
      <table>
        <tr>
          <th />
          {#each result as row, i}
            <th class="text-center">{i + 1}</th>
          {/each}
        </tr>
        {#each result as row, i}
          <tr>
            <th class="h-10 text-center">{i + 1}</th>
            {#each row as el, j}
              <td class="w-16 h-10 text-center">
                {@html el === Infinity ? `&#8734;` : el}
              </td>
            {/each}
          </tr>
        {/each}
      </table>
    </div>
  {/each}
</div>
