<script>
  import * as _ from "lodash";
  import { myGraph } from "../../stores/graphStore";
  import { nanoid } from "nanoid/non-secure";
  import cytoscape from "cytoscape";
  import { tick } from "svelte";
  import { graphToJson, createFlowNetwork } from "../../utils/cytoscapehelper";
  let fordFulkersonResult = {};

  let workingGraph = [];

  const fordFulkerson = async (graph) => {
    // add to working graph
    workingGraph.push({
      id: `graph_${workingGraph.length}`,
      graph: {},
    });
    workingGraph = workingGraph;
    await tick();
    workingGraph[workingGraph.length - 1].graph = cytoscape({});
    workingGraph[workingGraph.length - 1].graph.json(graph.json());
    workingGraph[workingGraph.length - 1].graph.mount(
      document.querySelector(`.${workingGraph[workingGraph.length - 1].id}`)
    );
    workingGraph[workingGraph.length - 1].graph.fit();

    graph = workingGraph[workingGraph.length - 1].graph;

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

    const fordFulkersonRecursive = async (cyGraph) => {
      workingGraph.push({
        id: `graph_${workingGraph.length}`,
        graph: {},
      });
      workingGraph = workingGraph;
      await tick();
      workingGraph[workingGraph.length - 1].graph = cytoscape({});
      workingGraph[workingGraph.length - 1].graph.json(cyGraph.json());
      workingGraph[workingGraph.length - 1].graph.mount(
        document.querySelector(`.${workingGraph[workingGraph.length - 1].id}`)
      );
      workingGraph[workingGraph.length - 1].graph.fit();

      cyGraph = workingGraph[workingGraph.length - 1].graph;

      cyGraph.elements().unselect();

      //   find a path from source to sink
      const source = cyGraph.nodes().find((n) => n.data("isSource"));
      const sink = cyGraph.nodes().find((n) => n.data("isSink"));

      //   find the path
      let dfs = cyGraph
        .elements()
        .filter((e) => e.isNode() || e.data("value") > 0)
        .depthFirstSearch({
          root: source,
          visit: (v, e, u, i, depth) => {
            if (v.data("isSink")) {
              return true;
            }
          },
          directed: true,
        });

      let pathEdges = dfs.path.edges();

      if (pathEdges.length === 0) {
        return;
      }

      dfs.path.select();

      console.log(
        "Found a path",
        pathEdges.map((e) => e.source().data("label"))
      );

      // find edge with min value in path
      let minEdge = pathEdges.find(
        (e) =>
          e.data("value") === Math.min(...pathEdges.map((e) => e.data("value")))
      );

      const min = minEdge.data("value");

      console.log(minEdge.data("value"));

      //   update edge values and labels
      for (let i = 0; i < pathEdges.length; i++) {
        const newValue = pathEdges[i].data("value") - min;
        pathEdges[i].data("value", newValue);
        pathEdges[i].data("label", pathEdges[i].data("value"));

        console.log(
          "updating edge",
          `${pathEdges[i].source().data("label")} -> ${pathEdges[i]
            .target()
            .data("label")}`,
          "newValuex: ",
          newValue
        );

        let backEdge = cyGraph
          .edges()
          .find(
            (edge) =>
              edge.data("source") === pathEdges[i].data("target") &&
              edge.data("target") === pathEdges[i].data("source")
          );

        console.log(
          "updating edge",
          `${backEdge.source().data("label")} -> ${backEdge
            .target()
            .data("label")}`,
          "newValuey: ",
          backEdge.data("value") + min
        );

        backEdge.data("value", backEdge.data("value") + min);
        backEdge.data("label", backEdge.data("value"));
      }

      // next recursion
      await fordFulkersonRecursive(cyGraph);
    };
    await fordFulkersonRecursive(graph);

    // revert the last graph from residual to normal graph
    graph = workingGraph[workingGraph.length - 1].graph;
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
        `${correspondingFrontEdge.data("flow")} / ${correspondingFrontEdge.data(
          "capacity"
        )}`
      );
      graph.remove(backEdges[i]);
    }
  };

  (async () => {
    if ($myGraph?.elements().length > 0) {
      workingGraph.push({
        id: `graph_${workingGraph.length}`,
        graph: {},
      });
      workingGraph = workingGraph;
      await tick();
      //   workingGraph[workingGraph.length - 1].graph = createFlowNetwork(
      //     $myGraph.elements().clone(),
      //     `.${workingGraph[workingGraph.length - 1].id}`
      //   );

      workingGraph[workingGraph.length - 1].graph = cytoscape({});
      workingGraph[workingGraph.length - 1].graph.json($myGraph.json());
      workingGraph[workingGraph.length - 1].graph.mount(
        document.querySelector(`.${workingGraph[workingGraph.length - 1].id}`)
      );
      workingGraph[workingGraph.length - 1].graph.fit();

      fordFulkerson(workingGraph[workingGraph.length - 1].graph);
    }
  })();
</script>

<div class="grid gap-4 grid-cols-3">
  {#each workingGraph as graph, i}
    <div
      class="flex flex-col justify-content-center border border-gray-500 mt-2 rounded-md"
    >
      <div class="cytoscape {graph.id}" />
    </div>
  {/each}
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }
</style>
