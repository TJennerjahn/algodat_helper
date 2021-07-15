<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";
  let tarjanSolution;

  const tarjan = (cyGraph) => {
    let nodes = cyGraph
      .nodes()
      .toArray()
      .map((doc) => {
        return { node: doc, color: "white", in: -1, l: -1 };
      });
    nodes.sort(
      (a, b) => parseInt(a.node.data("label")) - parseInt(b.node.data("label"))
    );
    console.log(nodes);
    let edges = cyGraph.edges().toArray();

    let time = 0;
    let stack = [];

    let solutionArray = [];

    const tarjanRecursive = (node) => {
      node.color = "gray";
      time++;
      node.in = time;
      node.l = time;
      stack.unshift(node);

      let succ = edges.filter(
        (edge) => edge.data("source") === node.node.data("id")
      );
      succ = succ.map((doc) => {
        return nodes.find((el) => el.node.data("id") === doc.data("target"));
      });
      succ.sort(
        (a, b) =>
          parseInt(a.node.data("label")) - parseInt(b.node.data("label"))
      );
      for (let i = 0; i < succ.length; i++) {
        if (succ[i].color === "white") {
          tarjanRecursive(succ[i]);
          node.l = Math.min(node.l, succ[i].l);
        } else if (
          stack.find((el) => el.node.data("id") === succ[i].node.data("id")) !==
          undefined
        ) {
          node.l = Math.min(node.l, succ[i].in);
        }
      }
      solutionArray.push({
        v: node.node.data("label"),
        in: node.in,
        l: node.l,
      });
      if (node.l === node.in) {
        console.log("Starke Komponente");
        let u;
        do {
          u = stack[0];
          console.log(u.node.data("label"));
          stack.shift();
        } while (u.node.data("id") != node.node.data("id"));
      }

      node.color = "black";
    };

    tarjanRecursive(nodes[0]);

    return solutionArray;
  };

  if($myGraph?.elements().length > 0) {
    console.log('myGraph', $myGraph);
    tarjanSolution = tarjan($myGraph);
  }
</script>

{#if tarjanSolution !== undefined}
  <table class="w-1/3 text-center">
    <tr>
      <th>v</th>
      <th>in[v]</th>
      <th>l[v]</th>
    </tr>

    {#each tarjanSolution as entry}
      <tr>
        <td>{entry.v}</td>
        <td>{entry.in}</td>
        <td>{entry.l}</td>
      </tr>
    {/each}
  </table>
{/if}
