import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
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

export {
    createGraph
}