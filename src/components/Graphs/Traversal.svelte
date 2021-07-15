<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore.js";

  let traversalSolution = {
    bfs: [],
    dfs: [],
  };

  const bfs = (cyGraph) => {
    let solution = [];
    let nodes = cyGraph.nodes();
    let edges = cyGraph.edges();
    // sort nodes by label
    nodes.sort((a, b) => parseInt(a.data("label")) - parseInt(b.data("label")));

    nodes = nodes.map((doc) => {
      return {
        visited: false,
        node: doc,
      };
    });

    let queue = [];
    queue.push(nodes[0]);

    while (queue.length > 0) {
      let node = queue.shift();
      if (!node.visited) {
        node.visited = true;
        solution.push(node.node.data("label"));
        let outGoingEdges = edges.filter(
          (e) =>
            e.data("source") === node.node.data("id") &&
            e.target().data("label") !== node.node.data("label")
        );
        let connectedNodes = nodes.filter((n) =>
          outGoingEdges.find((e) => e.data("target") === n.node.data("id"))
        );
        connectedNodes.sort(
          (a, b) =>
            parseInt(a.node.data("label")) - parseInt(b.node.data("label"))
        );

        connectedNodes.forEach((n) => {
          if (!n.visited) {
            queue.push(n);
          }
        });
      }
    }

    traversalSolution.bfs = solution;
  };

  const dfs = (cyGraph) => {
    let solution = [];
    let nodes = cyGraph.nodes();
    let edges = cyGraph.edges();
    // sort nodes by label
    nodes.sort((a, b) => parseInt(a.data("label")) - parseInt(b.data("label")));
    nodes = nodes.map((doc) => {
      return {
        visited: false,
        node: doc,
      };
    });
    let stack = [];
    stack.push(nodes[0]);
    while (stack.length > 0) {
      let node = stack.pop();
      if (!node.visited) {
        node.visited = true;
        solution.push(node.node.data("label"));
        let outGoingEdges = edges.filter(
          (e) =>
            e.data("source") === node.node.data("id") &&
            e.target().data("label") !== node.node.data("label")
        );
        let connectedNodes = nodes.filter((n) =>
          outGoingEdges.find((e) => e.data("target") === n.node.data("id"))
        );
        connectedNodes.sort(
          (a, b) =>
            parseInt(a.node.data("label")) - parseInt(b.node.data("label"))
        );
        connectedNodes.reverse();
        connectedNodes.forEach((n) => {
          stack.push(n);
        });
      }
    }
    traversalSolution.dfs = solution;
  };

  if ($myGraph?.elements().length > 0) {
    bfs($myGraph);
    dfs($myGraph);
    console.log("traversalresult", traversalSolution);
  }
</script>

<p>DFS: {traversalSolution.dfs.join(", ")}</p>
<p>BFS:{traversalSolution.bfs.join(", ")}</p>
