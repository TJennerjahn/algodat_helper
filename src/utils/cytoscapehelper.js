import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import avsdf from 'cytoscape-avsdf';
import { nanoid } from "nanoid/non-secure";
cytoscape.use(dagre);
cytoscape.use(avsdf);

function createGraph(graph, querySelector) {
    let temp = cytoscape({
        container: document.querySelector(querySelector),
        elements: graph.graph,
        style: [
            {
                selector: "node",
                style: {
                    label: function (ele) {
                        let data = ele.data("label");
                        let balanceFactor = ele.data("balanceFactor");
                        if (balanceFactor !== undefined) {
                            return `${data} (${ele.data("balanceFactor")})`;
                        }
                        return ele.data("label");
                    },
                    'background-color': function (ele) {
                        return ele.data('color') || 'LightGrey';
                    },
                    'font-size': '10px',
                    "text-justification": "center",
                    "text-halign": "center",
                    "text-valign": "center",
                },
            },
            {
                selector: "edge",
                style: {
                    label: function (ele) {
                        let data = ele.data("label");
                        if (data !== undefined && data !== null) {
                            return data;
                        }
                        return "";
                    },
                    // "text-margin-y": "-20px",
                    "edge-text-rotation": "autorotate"
                }
            }
        ],
    });


    temp
        .layout({
            name: "dagre",
            ranker: "network-simplex",
            rankDir: "TB",
            align: "DL",
            animate: true,
            animationDuration: 100,
        })
        .run();

    temp.center();
    temp.fit();
}

function createFlowNetwork(input, querySelector) {
    if (input === undefined || input === null) {
        input = [
            {
                group: "nodes",
                data: {
                    id: nanoid(),
                    label: "S",
                    isSource: true,
                    isSink: false
                },
            },
            {
                group: "nodes",
                data: {
                    id: nanoid(),
                    label: "T",
                    isSource: false,
                    isSink: true
                },
            },
        ];
    }
    let temp = cytoscape({
        container: document.querySelector(querySelector),
        elements: input,
        style: [
            {
                selector: "node",
                style: {
                    label: function (ele) {
                        let data = ele.data("label");
                        return ele.data("label");
                    },
                    "background-color": function (ele) {
                        return ele.data("color") || "LightGrey";
                    },
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
                    label: function (ele) {
                        let data = ele.data("label");
                        if (data !== undefined && data !== null) {
                            return data;
                        }
                        return "";
                    },
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
        layout: 'preset'

    });

    // temp
    //     .layout({
    //         name: "avsdf",
    //         animate: true,
    //         padding: 150,
    //         nodeSeparation: 100,
    //         animationDuration: 100,
    //     })
    //     .run();

    // temp.center();
    // temp.fit();

    return temp;

    // temp.on("cxttap", (e) => {
    //     if (e.target === temp) {
    //         selectedNodes = [];
    //         selectedEdges = [];
    //         console.log("Emptying the selected Nodes array");
    //         temp.filter("node").unselect();
    //         temp.filter("edge").unselect();
    //     } else if (e.target.isNode() || e.target.isEdge()) {
    //         if (e.target.isNode() && (e.target.data("isSource") || e.target.data("isSink"))) {
    //             return;
    //         }
    //         temp.remove(e.target);
    //     }
    // });
}

function graphToJson(graph) {
    let json = [];
    graph.nodes().forEach(function (node) {
        json.push({
            group: "nodes",
            data: node.data(),
            renderedPosition: {
                x: node.relativePosition("x"),
                y: node.relativePosition("y"),
            }
        });
    });

    graph.edges().forEach(function (edge) {
        json.push({
            group: "edges",
            data: edge.data(),
        });
    });
    return json;
}

function createResidualGraph(cyGraph) {
    if (cyGraph?.elements().length > 0) {
        let residualGraph = cyGraph;

        let newEdges = [];

        const edges = residualGraph.edges().toArray();
        for (let i = 0; i < edges.length; i++) {

            let newEdge = {
                group: "edges",
                data: {
                    id: nanoid(),
                    source: edges[i].data("source"),
                    target: edges[i].data("target"),
                    value: edges[i].data("capacity") - edges[i].data("flow"),
                    label: edges[i].data("capacity") - edges[i].data("flow"),
                    isBackEdge: false,
                },
            };

            newEdges.push(newEdge);

            let newBackEdge = {
                group: "edges",
                data: {
                    id: nanoid(),
                    source: edges[i].data("target"),
                    target: edges[i].data("source"),
                    value: edges[i].data("flow"),
                    label: edges[i].data("flow"),
                    isBackEdge: true,
                },
            }

            newEdges.push(newBackEdge);
        }

        // remove all old edges
        for(let i = 0; i < edges.length; i++) {
            residualGraph.remove(edges[i]);
        }

        // add all new edges
        for(let i = 0; i < newEdges.length; i++) {
            residualGraph.add(newEdges[i]);
        }

        return residualGraph;
    }
    else {
        return cyGraph;
    }
}

function residualToNormalGraph(cyGraph) {
    let backEdges = cyGraph.edges().filter(e => e.data("isBackEdge"));
    for (let i = 0; i < backEdges.length; i++) {
        let correspondingFrontEdge = cyGraph.edges().find(e => e.data("source") === backEdges[i].data("target") && e.data("target") === backEdges[i].data("source") && e.data("isBackEdge") === !backEdges[i].data("isBackEdge"));
        if(correspondingFrontEdge) {
            correspondingFrontEdge.data("flow", backEdges[i].data("value"));
            correspondingFrontEdge.data("capacity", backEdges[i].data("value") + correspondingFrontEdge.data("value"));
            correspondingFrontEdge.data("label", `${correspondingFrontEdge.data("flow")} / ${correspondingFrontEdge.data("capacity")}`);
            cyGraph.remove(backEdges[i]);
        }
    }

    return cyGraph;
}

function findMaxAugmentingPath(residualGraph, sourceId, sinkId) {
    const source = residualGraph.nodes().find(n => n.data("id") === sourceId);
    const sink = residualGraph.nodes().find(n => n.data("id") === sinkId);


    const edges = residualGraph.edges();

    let currentFlow = 0;
    let sinkEdges = edges.filter(e => e.data("target") === sinkId);
    for (let i = 0; i < sinkEdges.length; i++) {
        currentFlow += sinkEdges[i].data("value");
    }

    // find all possible paths from source to sink and store them in a paths array
    let paths = [];
    let unvisitedNodes = residualGraph.nodes().filter(n => n.data("id") !== sourceId);
    const findPathsRecursive = (source, sink, path, unvisitedNodes) => {
        if (source.data("id") === sink.data("id")) {
            paths.push(path);
            return;
        }

        // filter edges to only those that start at source
        const edgesStartingAtSource = residualGraph.edges().filter(e => e.data("source") === source.data("id"));

        // filter edges to only those that have unvisited target nodes
        const edgesToVisit = edgesStartingAtSource.filter(e => unvisitedNodes.find(n => n.data("id") === e.data("target")));

        // recursively find paths from each edge
        for (let i = 0; i < edgesToVisit.length; i++) {
            const newPath = path.slice();
            newPath.push(edgesToVisit[i]);
            findPathsRecursive(edgesToVisit[i].target(), sink, newPath, unvisitedNodes.filter(n => n.data("id") !== edgesToVisit[i].data("target")));
        }

    };

    findPathsRecursive(source, sink, [], unvisitedNodes);


    // find the path with the highest flow
    let maxFlow = 0;
    let maxFlowPath = [];
    for (let i = 0; i < paths.length; i++) {
        // find edge with least value in path
        let minEdge = paths[i][0];
        for (let j = 1; j < paths[i].length; j++) {
            if (paths[i][j].data("value") < minEdge.data("value")) {
                minEdge = paths[i][j];
            }
        }
        if (minEdge.data("value") > maxFlow) {
            maxFlow = minEdge.data("value");
            maxFlowPath = paths[i];
        }
    }

    return {
        flow: maxFlow,
        path: maxFlowPath,
    };
}

function fordFulkerson(cyGraph, sourceId, sinkId) {
    let residualGraph = createResidualGraph(cyGraph);
    // return residualGraph;
    const fordFulkersonRecursive = (graph) => {
        console.log("sourceId", sourceId, "sinkId", sinkId);


        if (sourceId === undefined || sinkId === undefined) {
            var source = graph.nodes().find(n => n.data("isSource"));
            var sink = graph.nodes().find(n => n.data("isSink"));
        } else {
            var source = graph.nodes().find(n => n.data("id") === sourceId);
            var sink = graph.nodes().find(n => n.data("id") === sinkId);
        }

        // find augmenting path
        let result = findMaxAugmentingPath(graph, source.data("id"), sink.data("id"));
        let flow = result.flow;
        let augmentingPath = result.path;
        if (augmentingPath === [] || flow === 0) {
            return graph;   // no augmenting path found
        }
        // augmenting path found
        // add flow to residual graph
        for (let i = 0; i < augmentingPath.length; i++) {
            const newValue = augmentingPath[i].data("value") - flow;
            let edge = graph.edges().find(e => e.data("id") === augmentingPath[i].data("id"));
            edge.data("value", newValue);
            edge.data("label", newValue);

            let backEdge = graph.edges().find(e => e.data("target") === augmentingPath[i].source().data("id") && e.data("source") === augmentingPath[i].target().data("id") && e.data("isBackEdge") === !augmentingPath[i].data("isBackEdge"));
            if (backEdge) {
                backEdge.data("value", backEdge.data("value") + flow);
                backEdge.data("label", backEdge.data("value"));
            }
        }

        fordFulkersonRecursive(graph);
    };

    fordFulkersonRecursive(residualGraph);

    return residualGraph;
}


function convertUndirectedToDirectedGraph(cyGraph) {

    let dGraph = cyGraph;

    let edges = dGraph.edges();
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let newEdge = {
            group: "edges",
            data: {
                id: nanoid(),
                source: edge.data("source"),
                target: edge.data("target"),
                capacity: edge.data("weight"),
                flow: 0,
                label: `0 / ${edge.data("weight")}`,
                isBackEdge: false,
            },
            style: {
                "target-arrow-shape": "triangle",
            }
        };

        let newBackEdge = {
            group: "edges",
            data: {
                id: nanoid(),
                source: edge.data("target"),
                target: edge.data("source"),
                capacity: edge.data("weight"),
                flow: 0,
                label: `0 / ${edge.data("weight")}`,
                isBackEdge: true,
            },
            style: {
                "target-arrow-shape": "triangle",
            }
        };

        // remove old edge from graph
        dGraph.remove(edge);

        // add new edge to graph
        dGraph.add(newEdge);
        dGraph.add(newBackEdge);
    }

    return dGraph;

}

export {
    createGraph,
    createFlowNetwork,
    graphToJson,
    createResidualGraph,
    findMaxAugmentingPath,
    fordFulkerson,
    convertUndirectedToDirectedGraph,
    residualToNormalGraph
};