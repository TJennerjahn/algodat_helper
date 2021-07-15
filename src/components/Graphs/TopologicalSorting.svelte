<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";

    let topologicalSortSolution = [];

  // function to convert ints between 0 and 26 to uppercase letters
  function toUpperCase(n) {
    return String.fromCharCode(n + 64);
  }

  const topologicSort = (cyGraph) => {
    let nodes = cyGraph.nodes().toArray();
    let edges = cyGraph.edges().toArray();

    let solution = [];

    while (nodes.length > 0) {
      // filter all nodes with no incoming edges
      let startNodes = nodes.filter((node) => {
        return (
          edges.filter((edge) => {
            return edge.data("target") === node.data("id");
          }).length === 0
        );
      });

      // print all start node labels
      let startNodeLabels = startNodes.map((node) => {
        return node.data("label");
      });
      console.log("Start nodes: " + startNodeLabels.join(", "));

      // if no start nodes, break
      if (startNodes.length === 0) {
        break;
      }

      // sort nodes by label
      startNodes.sort((a, b) => {
        return parseInt(a.data("label")) - parseInt(b.data("label"));
      });

      console.log(startNodes[0].data("label"));

      // add label of first node to solution
      solution.push(startNodes[0].data("label"));

      // remove node from nodes
      nodes = nodes.filter((node) => {
        return node.data("id") !== startNodes[0].data("id");
      });

      // remove all edges to/from the first node
      edges = edges.filter((edge) => {
        return (
          edge.data("source") !== startNodes[0].data("id") &&
          edge.data("target") !== startNodes[0].data("id")
        );
      });
    }

    console.log(solution);
    console.log(solution.map(doc => toUpperCase(doc)));
    return solution;
  };

  if ($myGraph?.elements.length > 0) {
    topologicalSortSolution = topologicSort($myGraph);
  }
</script>

<p>{topologicalSortSolution.join(", ")}</p>
<p>{topologicalSortSolution.map(doc => toUpperCase(doc)).join(", ")}</p>