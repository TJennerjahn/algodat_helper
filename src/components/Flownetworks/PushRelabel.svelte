<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";
  import { nanoid } from "nanoid/non-secure";

  let pushrelabelSolutionArray = [];

  const pushrelabel = (graph) => {
    pushrelabelSolutionArray = [];

    // init node heights
    let nodes = graph.nodes();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].data("isSource") === true) {
        nodes[i].data("height", nodes.length);
        // get outgoing edges
        let edges = graph
          .edges()
          .filter((e) => e.source().data("id") === nodes[i].data("id"));
        nodes[i].data(
          "excess",
          edges.reduce((a, b) => a + b.data("capacity") - b.data("flow"), 0)
        );
      } else {
        nodes[i].data("height", 0);
        nodes[i].data("excess", 0);
      }
    }

    //   create residual graph
    let edges = graph.edges();
    for (let i = 0; i < edges.length; i++) {
      graph.add({
        group: "edges",
        data: {
          id: nanoid(),
          source: edges[i].data("source"),
          target: edges[i].data("target"),
          value: edges[i].data("capacity") - edges[i].data("flow"),
          label: edges[i].data("capacity") - edges[i].data("flow"),
          isBackEdge: false,
        },
      });

      graph.add({
        group: "edges",
        data: {
          id: nanoid(),
          source: edges[i].data("target"),
          target: edges[i].data("source"),
          value: edges[i].data("flow"),
          label: edges[i].data("flow"),
          isBackEdge: true,
        },
      });

      graph.remove(edges[i]);
    }

    edges = graph.edges();
    nodes = graph.nodes();
    let sortedNodes = [];
    sortedNodes.push(nodes.find((n) => n.data("isSource") === true));
    let numberNodes = nodes
      .filter((n) => {
        return n.data("isSource") === false && n.data("isSink") === false;
      })
      .toArray();
    numberNodes.sort((a, b) => b.data("label") - a.data("label"));
    console.log("numbernodes", numberNodes);
    sortedNodes = sortedNodes.concat(numberNodes);
    sortedNodes.push(nodes.find((n) => n.data("isSink") === true));

    // remove undefined or null nodes from sortedNodes array
    sortedNodes = sortedNodes.filter((n) => n);

    console.log(
      "SortedNodes length:",
      sortedNodes.length,
      sortedNodes.map((n) => n?.data())
    );

    while (true) {
      for (let i = 0; i < sortedNodes.length; i++) {
        if (sortedNodes[i].data("excess") <= 0) {
          continue;
        }
        console.log(`Checking Node: ${sortedNodes[i].data("label")}`);
        // get all outgoing edges
        let outgoingEdges = graph
          .edges().toArray()
          .filter((e) => e.data("source") === sortedNodes[i].data("id"));
        // sort outgoing edges by target node label
        outgoingEdges.sort(
          (a, b) => b.target().data("label") - a.target().data("label")
        );

        let wasPushable = true;

        while (wasPushable) {
          wasPushable = false;
          // loop over outgoing edges
          for (let j = 0; j < outgoingEdges.length; j++) {
            // if current node height is greater than the target node height, push all remaining capacity to the target node
            if (
              sortedNodes[i].data("height") >
              outgoingEdges[j].target().data("height")
            ) {
              let remainingCapacity = outgoingEdges[j].data("value");
              if (remainingCapacity > 0 && sortedNodes[i].data("excess") > 0) {
                remainingCapacity = Math.min(
                  remainingCapacity,
                  sortedNodes[i].data("excess")
                );
                wasPushable = true;
                let target = outgoingEdges[j].target();
                target.data(
                  "excess",
                  target.data("excess") + remainingCapacity
                );

                sortedNodes[i].data(
                  "excess",
                  sortedNodes[i].data("excess") - remainingCapacity
                );

                // add remaining capacitu to back edge
                let backEdge = edges.find((e) => {
                  return (
                    e.data("source") === target.data("id") &&
                    e.data("target") === outgoingEdges[j].data("source") &&
                    e.data("isBackEdge") ===
                      !outgoingEdges[j].data("isBackEdge")
                  );
                });
                backEdge.data(
                  "value",
                  backEdge.data("value") + remainingCapacity
                );
                backEdge.data("label", backEdge.data("value"));

                // remove remaining capacity from current edge
                outgoingEdges[j].data(
                  "value",
                  outgoingEdges[j].data("value") - remainingCapacity
                );
                outgoingEdges[j].data("label", outgoingEdges[j].data("value"));

                pushrelabelSolutionArray.push(
                  `Push von ${sortedNodes[i].data("label")} nach ${target.data(
                    "label"
                  )}`
                );
                break;
              }
            }
          }
        }

        // if no numbered node has excess capacity, we are done
        let numberedNodes = graph.nodes().filter((n) => {
          return (
            n.data("isSource") === false &&
            n.data("isSink") === false &&
            n.data("excess") > 0
          );
        });
        if (numberedNodes.length === 0) {
          console.log("No more nodes with excess capacity. Solution found.");
          let backEdges = graph.edges().filter((e) => e.data("isBackEdge"));
          for (let i = 0; i < backEdges.length; i++) {
            let correspondingFrontEdge = graph
              .edges()
              .find(
                (edge) =>
                  edge.data("source") === backEdges[i].data("target") &&
                  edge.data("target") === backEdges[i].data("source") &&
                  edge.data("isBackEdge") === !backEdges[i].data("isBackEdge")
              );
            correspondingFrontEdge.data("flow", backEdges[i].data("value"));
            correspondingFrontEdge.data(
              "capacity",
              backEdges[i].data("value") + correspondingFrontEdge.data("value")
            );
            correspondingFrontEdge.data(
              "label",
              `${correspondingFrontEdge.data(
                "flow"
              )} / ${correspondingFrontEdge.data("capacity")}`
            );
            graph.remove(backEdges[i]);
          }

          pushrelabelSolutionArray = pushrelabelSolutionArray;
          return;
        }

        // sort excess nodes by label
        let excessNodes = graph.nodes().toArray().filter((n) => {
          return (
            n.data("isSource") === false &&
            n.data("isSink") === false &&
            n.data("excess") > 0
          );
        });
        excessNodes.sort((a, b) => b.data("label") - a.data("label"));
        // relabel smallest excess nodes so that it is one higher than the next smallest node
        let outGoingEdges = edges.filter((e) => {
          return (
            e.data("source") === excessNodes[0].data("id") &&
            e.data("value") > 0
          );
        });
        // find min height of outgoingEdge targets
        let minHeight = Number.MAX_VALUE;
        for (let j = 0; j < outGoingEdges.length; j++) {
          if (outGoingEdges[j].target().data("height") < minHeight) {
            minHeight = outGoingEdges[j].target().data("height");
          }
        }

        if (minHeight + 1 > excessNodes[0].data("height")) {
          const oldHeight = excessNodes[0].data("height");
          excessNodes[0].data("height", minHeight + 1);

          pushrelabelSolutionArray.push(
            `Relabel ${excessNodes[0].data("label")} zu h=${excessNodes[0].data(
              "height"
            )}`
          );
        }
      }
    }
  };

  if ($myGraph?.elements().length > 0) {
    pushrelabel($myGraph);
    console.log("Pushrelabel", pushrelabelSolutionArray);
  }
</script>

{#each pushrelabelSolutionArray as pushrelabelSolution}
  <p>{pushrelabelSolution}</p>
{/each}
