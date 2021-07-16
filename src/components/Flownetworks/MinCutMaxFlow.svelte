<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";

  let solution = {};

  const minCutMaxFlow = (cyGraph) => {
    let result = cyGraph.elements().kargerStein();
    solution.a = result.partition1.map((x) => x.data("label"));
    solution.b = result.partition2.map((x) => x.data("label"));
    solution.maxFlow = result.cut.reduce((a, b) => a + b.data("weight"), 0);
    console.log(result);
  };

  if ($myGraph?.elements().length > 0) {
    minCutMaxFlow($myGraph);
    console.log("solution", solution);
  }
</script>

<p>Partition A: {solution.a.join(", ")}</p>
<p>Partition B: {solution.b.join(", ")}</p>
<p>Max Flow: {solution.maxFlow}</p>
