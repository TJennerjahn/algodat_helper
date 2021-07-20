<script>
  import { tick } from "svelte";
  import { nanoid } from "nanoid/non-secure";
  import * as _ from "lodash";

  import cytoscape from "cytoscape";
  import avsdf from "cytoscape-avsdf";
  cytoscape.use(avsdf);

  import { myGraph } from "../../stores/graphStore";

  console.log("myGraph", $myGraph);

  let isDirectional = true;

  // let inputValue = "6,11,1,2,1,3,3,1,4,1,3,4,3,6,5,3,5,5,6,5,6,2,6,4";
  // let inputValue = "6, 8,  1,2, 1,6, 2,3, 3,2, 3,4, 5,1, 6,3, 6,5";
  // let inputValue = "0,5,3,11,0,0,0,0,0,4,7,0,0,1,0,0,4,0,0,0,0,0,2,0,0,0,0,1,0,8,0,0,0,6,0,0";
  // let inputValue = "0,8,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,4,2,0,0,0,5,0,2,0,0,0,1,6,0,0,0,0,0,0,0,0,0,0,0,1,7,0,0,0,0,1,0,0,0,3,0";

  // let inputValue = "0,0,-3,-1,-1,1,0,0,-3,0,0,3,0,4,0,0,0,0,0,-4,0,0,1,0,0";
  // let inputValue = "9,10,1,3,2,3,3,4,4,6,4,7,5,4,6,8,6,9,7,6,7,9";
  // let inputValue = "7,10,1,2,1,6,2,3,2,5,4,2,4,7,5,3,5,7,6,4,7,6";
  let inputValue = "0,0,10,0,0,5,0,0,0,0,0,0,0,0,0,0,1,3,0,1,0,0,0,0,0,9,0,11,0,0,0,3,0,4,6,0";

  let selectedNodes = [];
  let selectedEdges = [];

  let edgeListRepresentation = "";
  let nodeListRepresentation = "";


  let graph;
  if ($myGraph !== undefined) {
    graph = $myGraph;
  }

  const createGraph = (input) => {
    if (input === undefined || input === null) {
      input = [];
    }
    let temp = cytoscape({
      container: document.querySelector("#graphbuilder"),
      elements: input,
      style: [
        {
          selector: "node",
          style: {
            'label': 'data(label)',
            "background-color": "LightGrey",
            "font-size": "10px",
            "text-justification": "center",
            "text-halign": "center",
            "text-valign": "center",
          },
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            'label': 'data(label)',
            "text-margin-y": "-20px",
            "edge-text-rotation": "autorotate",
          },
        },
        {
          selector: ":selected",
          css: {
            "background-color": "SteelBlue",
            "line-color": "black",
            "target-arrow-color": "black",
            "source-arrow-color": "black",
          },
        },
      ],
    });

    temp
      .layout({
        name: "avsdf",
        // ranker: "network-simplex",
        // rankDir: "TB",
        // align: "DL",
        animate: true,
        padding: 150,
        nodeSeparation: 100,
        animationDuration: 100,
      })
      .run();

    temp.center();
    // temp.fit();

    console.log(temp);
    console.log(temp.filter("node").length + 1);

    temp.on("cxttap", (e) => {
      if (e.target === temp) {
        selectedNodes = [];
        selectedEdges = [];
        console.log("Emptying the selected Nodes array");
        temp.filter("node").unselect();
        temp.filter("edge").unselect();
      } else if (e.target.isNode() || e.target.isEdge()) {
        temp.remove(e.target);
      }
    });

    temp.on("tap", (e) => {
      if (e.target === temp) {
        temp.add([
          {
            group: "nodes",
            data: {
              id: nanoid(),
              label: e.cy.filter("node").length + 1,
            },

            renderedPosition: {
              x: e.renderedPosition.x,
              y: e.renderedPosition.y,
            },
          },
        ]);
      } else if (e.target.isNode()) {
        console.log("You Tapped a Node");
        selectedNodes = [...selectedNodes, e.target];
        console.log("selectedNodes", selectedNodes);
      } else if (e.target.isEdge()) {
        selectedEdges = [e.target];
        console.log("You tapped an Edge");
      }
    });

    myGraph.set(temp);
    return temp;
  };

  const addEdge = (nodeArray) => {
    if (nodeArray.length === 2) {
      console.log("Two Nodes selected, adding edge");

      $myGraph.add([
        {
          group: "edges",
          data: {
            id: nanoid(),
            source: nodeArray[0].id(),
            target: nodeArray[1].id(),
          },
          style: {
            "target-arrow-shape": isDirectional ? "triangle" : "none",
          },
        },
      ]);

      selectedNodes = [];
    }

    edgeListRepresentation = calculateEdgeList().toString();
    nodeListRepresentation = calculateNodeList().toString();
  };

  $: addEdge(selectedNodes);

  const setEdgeWeight = (edge, weight) => {
    edge.data("weight", weight);
    edge.data("label", weight);
  };

  const calculateEdgeList = () => {
    if (graph === undefined) {
      return [];
    }
    let result = [];

    let nodes = graph.filter("node").toArray();
    result.push(nodes.length);

    let edges = graph.filter("edge").toArray();
    result.push(edges.length);

    nodes.sort((a, b) => parseInt(a.data("label")) - parseInt(b.data("label")));
    for (let i = 0; i < nodes.length; i++) {
      let tempEdges = edges.filter(
        (edge) => edge.source().data("label") === nodes[i].data("label")
      );
      tempEdges.sort(
        (a, b) =>
          parseInt(a.target().data("label")) -
          parseInt(b.target().data("label"))
      );
      for (let j = 0; j < tempEdges.length; j++) {
        result.push(tempEdges[j].source().data("label"));
        result.push(tempEdges[j].target().data("label"));
      }
    }

    return result;
  };

  const calculateNodeList = () => {
    if (graph === undefined) {
      return [];
    }
    let result = [];

    let nodes = graph.filter("node").toArray();
    result.push(nodes.length);

    let edges = graph.filter("edge").toArray();
    result.push(edges.length);

    nodes.sort((a, b) =>a.data("label") - b.data("label"));
    for (let i = 0; i < nodes.length; i++) {
      let outEdges = edges.filter(
        (edge) => edge.source().data("label") === nodes[i].data("label")
      );
      outEdges.sort(
        (a, b) =>
          a.target().data("label") -
          b.target().data("label")
      );

      result.push(outEdges.length);
      for(let j = 0; j < outEdges.length; j++) {
        result.push(outEdges[j].target().data("label"));
      }
    }

    return result;
  };

  const graphFromEdgeList = (edgeList) => {
    let list = edgeList.split(",").map((doc) => parseInt(doc));

    let nodeCount = list.shift();
    let edgeCount = list.shift();

    let result = [];

    for (let i = 0; i < nodeCount; i++) {
      result.push({
        group: "nodes",
        data: {
          id: nanoid(),
          label: i + 1,
        },
      });
    }

    for (let j = 0; j < edgeCount * 2; j += 2) {
      result.push({
        group: "edges",
        data: {
          id: nanoid(),
          source: result.find(
            (el) => el.group === "nodes" && el.data.label === list[j]
          ).data.id,
          target: result.find(
            (el) => el.group === "nodes" && el.data.label === list[j + 1]
          ).data.id,
        },
        style: {
          "target-arrow-shape": isDirectional ? "triangle" : "none",
        },
      });
    }

    console.log(nodeCount, edgeCount, result);

    return createGraph(result);
  };

  const graphFromNodeList = (nodeList) => {
    let list = nodeList.split(",").map((doc) => parseInt(doc));

    let nodeCount = list.shift();
    let edgeCount = list.shift();

    let result = [];

    for (let i = 0; i < nodeCount; i++) {
      result.push({
        group: "nodes",
        data: {
          id: nanoid(),
          label: i + 1,
        },
      });
    }

    let count = 0;
    while (list.length > 0) {
      let outGoingEdgeCount = list.shift();
      for (let i = 0; i < outGoingEdgeCount; i++) {
        let targetNode = list.shift();
        result.push({
          group: "edges",
          data: {
            id: nanoid(),
            source: result.find(
              (el) => el.group === "nodes" && el.data.label === count + 1
            ).data.id,
            target: result.find(
              (el) => el.group === "nodes" && el.data.label === targetNode
            ).data.id,
          },
          style: {
            "target-arrow-shape": isDirectional ? "triangle" : "none",
          },
        });
      }
      count++;
    }

    return createGraph(result);
  };

  const graphFromAdjacencyMatrix = (adjacencyMatrix) => {
    adjacencyMatrix = adjacencyMatrix.split(",").map((doc) => parseInt(doc));
    let matrixSize = parseInt(Math.sqrt(adjacencyMatrix.length));

    console.log(adjacencyMatrix);

    let newGraph = [];

    for (let i = 0; i < matrixSize; i++) {
      newGraph.push({
        group: "nodes",
        data: {
          id: nanoid(),
          label: i + 1,
        },
      });
    }

    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        if (adjacencyMatrix[i * matrixSize + j] !== 0) {
          let newEdge = {
            group: "edges",
            data: {
              id: nanoid(),
              label: adjacencyMatrix[i * matrixSize + j],
              weight: adjacencyMatrix[i * matrixSize + j],
              source: newGraph.find(
                (el) => el.group === "nodes" && el.data.label === i + 1
              ).data.id,
              target: newGraph.find(
                (el) => el.group === "nodes" && el.data.label === j + 1
              ).data.id,
            },
            style: {
              "target-arrow-shape": isDirectional ? "triangle" : "none",
            },
          };

          if (
            isDirectional === true ||
            newGraph.find(
              (el) =>
                el.group === "edges" &&
                el.data.source === newEdge.data.target &&
                el.data.target === newEdge.data.source
            ) === undefined
          ) {
            newGraph.push(newEdge);
          }
        }
      }
    }

    console.log(newGraph);

    return createGraph(newGraph);
  };

  const getAdjacencyMatrix = (cyGraph) => {
    let nodes = cyGraph.nodes().sort((a, b) => {
      return parseInt(a.data("label")) - parseInt(b.data("label"));
    });
    let edges = cyGraph.edges();

    let result = [];
    for (let i = 0; i < nodes.length; i++) {
      let row = [];
      for (let j = 0; j < nodes.length; j++) {
        let edge = edges.find(
          (el) =>
            el.data("source") === nodes[i].data("id") &&
            el.data("target") === nodes[j].data("id")
        );
        if (edge === undefined && isDirectional === false) {
          edge = edges.find(
            (el) =>
              el.data("target") === nodes[i].data("id") &&
              el.data("source") === nodes[j].data("id")
          );
        }
        if (edge !== undefined) {
          let edgeWeight =
            edge.data("weight") === undefined ? 1 : edge.data("weight");
          row[j] = edgeWeight;
        } else {
          row[j] = 0;
        }
      }
      result.push(row);
    }

    return result;
  };

  const isCyclic = (collection) => {};

  (async function () {
    if ($myGraph === undefined) {
      await tick();
      graph = createGraph();
    } else {
      await tick();
      $myGraph.mount(document.querySelector("#graphbuilder"));
      await tick();
    }
  })();
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>

<input id="input" class="w-full" type="text" bind:value={inputValue} />
<div class="flex">
  {#if selectedEdges.length === 1}
    <button
      on:click={() => {
        setEdgeWeight(selectedEdges[0], parseInt(inputValue));
      }}
      class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
    >
      Kantengewicht setzen
    </button>
  {/if}

  <button
    on:click={() => {
      graph = graphFromEdgeList(inputValue);
    }}
    class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
  >
    Graph aus Kantenliste
  </button>

  <button
    on:click={() => {
      graph = graphFromNodeList(inputValue);
    }}
    class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
  >
    Graph aus Knotenliste
  </button>

  <button
    on:click={() => {
      graph = graphFromAdjacencyMatrix(inputValue);
    }}
    class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
  >
    Graph aus Adjazenzmatrix
  </button>

  <button
    on:click={async () => {
      $myGraph.unmount();
      await tick();
      graph = createGraph();
    }}
    class="bg-red-500 text-white px-1 py-1 rounded-md my-2"
  >
    Graph loeschen
  </button>
</div>

<label class="flex items-center">
  <input type="checkbox" bind:value={isDirectional} />
  <span class="ml-2">Gerichtet</span>
</label>
<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Graphbuilder</p>
  <div id="graphbuilder" class="cytoscape" />

  <div class="flex items-center w-1/3">
    <p>Kantenliste:</p>
    <p>{edgeListRepresentation}</p>
    <button
      on:click={() => {
        edgeListRepresentation = calculateEdgeList().toString();
      }}
      class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
    >
      Berechnen
    </button>
  </div>

  <div class="flex items-center w-1/3">
    <p>Knotenliste:</p>
    <p>{nodeListRepresentation}</p>
    <button
      on:click={() => {
        nodeListRepresentation = calculateNodeList().toString();
      }}
      class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
    >
      Berechnen
    </button>
  </div>

  <div class="flex items-center w-1/3">
    <button
      on:click={() => {
        let adjmtrx = getAdjacencyMatrix($myGraph);
        console.table(adjmtrx);
        console.log(adjmtrx.toString());
      }}
      class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
    >
      Adjazenzmatrix ausgeben
    </button>
  </div>
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }

  #graphbuilder {
    width: 100%;
    height: 600px;
    display: block;
  }
</style>
