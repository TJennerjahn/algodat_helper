import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import avsdf from 'cytoscape-avsdf';
cytoscape.use(dagre);

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

export {
    createGraph,
    createFlowNetwork,
    graphToJson,
};