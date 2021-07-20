<script>
  import * as _ from "lodash";
  import { tick } from "svelte";
  import { myGraph } from "../../stores/graphStore";
  import {
    fordFulkerson,
    convertUndirectedToDirectedGraph,
    createResidualGraph,
    residualToNormalGraph,
  } from "../../utils/cytoscapehelper";
  import cytoscape from "cytoscape";
  import { nanoid } from "nanoid/non-secure";

  const gomoryHu = async (cyGraph) => {
    let gomoryHuSolution = [];

    let newQueue = [];
    newQueue.push(cyGraph.nodes());
    let counter = 0;
    while (newQueue.length > 0 && counter < 2) {
      counter++;
      let nodes = newQueue.shift();
      if (nodes.length <= 2) {
        continue;
      }
      // sort nodes by label
      nodes.sort((a, b) => a.data("label") - b.data("label"));
      console.log(
        "newNodes",
        nodes.map((n) => n.data())
      );
      let dGraph = cytoscape({});
      for (let i = 0; i < nodes.length; i++) {
        dGraph.add({
          group: "nodes",
          data: nodes[i].data(),
        });
      }
      for (let i = 0; i < nodes.length; i++) {
        let nodeEdges = cyGraph
          .edges()
          .filter((e) => e.data("source") === nodes[i].data("id"));
        for (let j = 0; j < nodeEdges.length; j++) {
          dGraph.add({
            group: "edges",
            data: nodeEdges[j].data(),
          });
        }
      }
      console.log(
        "dgraph",
        dGraph.elements().map((el) => el.data())
      );

      dGraph = convertUndirectedToDirectedGraph(dGraph);
      dGraph = fordFulkerson(dGraph, nodes[0].data("id"), nodes[1].data("id"));

      // find all reachable nodes from the source
      let reachableNodes = [];
      let visited = [];
      let queue = [nodes[0]];
      while (queue.length > 0) {
        let node = queue.shift();
        visited.push(node);
        reachableNodes.push(node);
        let outEdges = dGraph
          .edges()
          .filter(
            (e) => e.data("source") === node.data("id") && e.data("value") !== 0
          );
        for (let i = 0; i < outEdges.length; i++) {
          if (
            !visited
              .map((n) => n.data("id"))
              .includes(outEdges[i].data("target"))
          ) {
            queue.push(outEdges[i].target());
          }
        }
      }

      //   reachableNodes = reachableNodes.filter(
      //     (n) => n.data("label") !== undefined
      //   );
      console.log("reachableNodes", reachableNodes);

      let partitionA = dGraph
        .nodes()
        .filter((n) =>
          reachableNodes.map((rn) => rn.data("id")).includes(n.data("id"))
        );
      let partitionB = dGraph
        .nodes()
        .filter(
          (n) =>
            !reachableNodes.map((rn) => rn.data("id")).includes(n.data("id"))
        );

      console.log("partitionA", partitionA);
      console.log("partitionB", partitionB);

      // find all edges that connect nodes in partitionA and partitionB
      let edges = [];
      partitionA.forEach((n) => {
        let outEdges = cyGraph
          .edges()
          .filter(
            (e) => e.data("source") === n.data("id") && e.data("value") !== 0
          );
        outEdges.forEach((e) => {
          if (
            partitionB.map((n) => n.data("id")).includes(e.target().data("id"))
          ) {
            edges.push(e);
          }
        });
      });
      console.log("edges", edges);

      gomoryHuSolution.push({
        V: [
          ...partitionA.map((n) => n.data("label")),
          ...partitionB.map((n) => n.data("label")),
        ].map((n) => n),
        s: nodes[0].data("label"),
        t: nodes[1].data("label"),
        cut: edges.map((e) => e.data("weight")).reduce((a, b) => a + b, 0),
      });

      console.log(_.cloneDeep(gomoryHuSolution));

      // create compound Nodes for each partition
      let compoundNodeA = {
        group: "nodes",
        data: {
          id: nanoid(),
        },
      };

      let compoundNodeB = {
        group: "nodes",
        data: {
          id: nanoid(),
        },
      };

      cyGraph.add(compoundNodeA);
      cyGraph.add(compoundNodeB);

      let temp = [...partitionA];
      temp.push(
        cyGraph.nodes().find((n) => n.data("id") === compoundNodeA.data["id"])
      );
      newQueue.push(temp);
      console.log("temp", temp);

      temp = [...partitionB];
      temp.push(
        cyGraph.nodes().find((n) => n.data("id") === compoundNodeB.data["id"])
      );
      newQueue.push(temp);
      console.log("temp", temp);

      // set partition Node parents
      partitionA.forEach((n) => {
        cyGraph
          .nodes()
          .find((nd) => nd.data("id") === n.data("id"))
          .move({
            parent: compoundNodeA.data["id"],
          });
      });
      partitionB.forEach((n) => {
        cyGraph
          .nodes()
          .find((nd) => nd.data("id") === n.data("id"))
          .move({
            parent: compoundNodeB.data["id"],
          });
      });

      // remove all edges that connect nodes in partitionA and partitionB
      edges.forEach((e) => {
        if (
          partitionA.map((n) => n.data("id")).includes(e.data("source")) &&
          partitionB.map((n) => n.data("id")).includes(e.data("target"))
        ) {
          e.move({
            target: compoundNodeA.data["id"],
          });

          console.log(
            "partition A changing edge to compound",
            e.map((x) => x.data())
          );
        }
        if (
          partitionB.map((n) => n.data("id")).includes(e.data("source")) &&
          partitionA.map((n) => n.data("id")).includes(e.data("target"))
        ) {
          e.move({
            target: compoundNodeB.data["id"],
          });
          console.log(
            "Partition B changing edge to compound",
            e.map((x) => x.data())
          );
        }
      });

      // add edge between compounds
      cyGraph.add({
        group: "edges",
        data: {
          id: nanoid(),
          source: compoundNodeA.data["id"],
          target: compoundNodeB.data["id"],
          weight: gomoryHuSolution[gomoryHuSolution.length - 1].cut,
          label: gomoryHuSolution[gomoryHuSolution.length - 1].cut,
        },
      });
    }

    // const maxFlow = dGraph
    //   .edges()
    //   .filter((e) => e.target().data("label") === nodes[1].data("label"))
    //   .map((e) => e.data("flow"))
    //   .reduce((a, b) => a + b, 0);
    // console.log("Min Cut - Max Flow: ", maxFlow);

    await tick();
    cyGraph.mount(document.querySelector(`#test`));
    await tick();
    cyGraph.center();
    cyGraph.fit();
    // cyGraph.style().update();
  };

  (async () => {
    if ($myGraph?.elements().length > 0) {
      gomoryHu($myGraph);
    }
  })();
</script>

<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Gomory Hu</p>
  <div id="test" class="cytoscape" />
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 450px;
    display: block;
  }

  /* #graphbuilder {
      width: 100%;
      height: 600px;
      display: block;
    } */
</style>
