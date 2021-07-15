<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";

  let kruskalresult;

  const kruskal = (cyGraph) => {
    let miniumSpanningTree = cyGraph.elements().kruskal((edge) => {
      return parseInt(edge.data("weight")) === NaN
        ? 1
        : parseInt(edge.data("weight"));
    });

    let nodes = cyGraph.nodes();

    miniumSpanningTree = miniumSpanningTree.toArray();
    miniumSpanningTree = miniumSpanningTree.filter((el) => el.isEdge());
    miniumSpanningTree = miniumSpanningTree.map((edge) => {
      return {
        start: cyGraph.$id(edge.data("source")).data("label"),
        end: cyGraph.$id(edge.data("target")).data("label"),
      };
    });

    return miniumSpanningTree;
  };

  if ($myGraph.elements().length > 0) {
    kruskalresult = kruskal($myGraph);
    console.log("Kruskal", kruskalresult);
    kruskalresult = kruskalresult
      .map((doc) => `{${doc.start}, ${doc.end}}`)
      .toString();
  }
</script>

<h1 class="text-xl text-gray-700">Kruskal:</h1>
<p>{kruskalresult}</p>
