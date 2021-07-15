import { nanoid } from "nanoid/non-secure";
import * as _ from "lodash";

class TravelingSalesmanTreeNode {
  constructor() {
    this.id = nanoid();
    this.children = [];
    this.parent = undefined;
    this.label = "";
  }
}

class TravelingSalesmanTree {
  constructor(adjacencyMatrix) {
    this.root = new TravelingSalesmanTreeNode();
    this.size = adjacencyMatrix.length;
    this.adjacencyMatrix = _.cloneDeep(adjacencyMatrix);
    this.root.label = "1";
    this.graphStructure = [];
    this.inOrderData = [];
  }

  create() {
    let nodes = Array.from({ length: this.size - 1 }, (v, i) => i + 2);
    const createRecursively = (node, unvisitedNodes) => {
      if (unvisitedNodes.length === 0) {
        let lastNode = new TravelingSalesmanTreeNode();
        lastNode.label = "1";
        node.children = [lastNode];
        node.children[0].parent = node;
        return;
      }
      for (let i = 0; i < unvisitedNodes.length; i++) {
        let newNode = new TravelingSalesmanTreeNode();
        node.children.push(newNode);
        node.children[node.children.length - 1].label =
          unvisitedNodes[i].toString();
        node.children[node.children.length - 1].parent = node;
        let temp = _.cloneDeep(unvisitedNodes);
        temp.splice(i, 1);
        createRecursively(node.children[node.children.length - 1], temp);
      }
    };

    createRecursively(this.root, nodes);
    return this;
  }

  maxDepth(node) {
    if (node === undefined || !node) {
      return 1;
    } else {
      let depths = [];
      if (node.children.length === 0) {
        return 1;
      }
      for (var i = 0; i < node.children.length; i++) {
        depths[i] = this.maxDepth(node.children[i]);
      }

      return Math.max(...depths) + 1;
    }
  }

  getDistance(a, b) {
    let row = parseInt(a.label);
    let col = parseInt(b.label);

    let distance = parseInt(this.adjacencyMatrix[row - 1][col - 1]);
    distance = Math.min(
      distance,
      parseInt(this.adjacencyMatrix[col - 1][row - 1])
    );

    return distance;
  }

  guessLocalDistance(a, b) {
    let row = parseInt(a.label) - 1;
    let col = parseInt(b.label) - 1;

    let forbiddenPairs = [];
    let currentNode = b;
    let deleteRow = true;

    let path = [];

    while (currentNode !== undefined && currentNode.parent !== undefined) {
      path.unshift({
        start: parseInt(currentNode.parent.label),
        end: parseInt(currentNode.label),
      });
      currentNode = currentNode.parent;
    }

    if (a.label === "5" && b.label === "2") {
      console.log(path);
    }
    // return 0;

    // const pathString = path.toString();

    while (path.length > 0) {
      for (let j = 0; j < this.size; j++) {
        forbiddenPairs.push({ i: path[0].start - 1, j: j });
      }
      for (let i = 0; i < this.size; i++) {
        forbiddenPairs.push({ i: i, j: path[0].end - 1 });
      }
      path.shift();
    }

    if (a.label === "5" && b.label === "2") {
      console.log(forbiddenPairs);
    }

    let sum = 0;

    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      let rowMinimum = Number.MAX_VALUE;
      for (let j = 0; j < this.adjacencyMatrix.length; j++) {
        let val = parseInt(this.adjacencyMatrix[i][j]);
        // console.log(i,j,val);

        if (
          forbiddenPairs.filter((el) => el.i === i && el.j === j).length > 0
        ) {
          continue;
        }

        if (isNaN(val)) {
          continue;
        }

        if (val < rowMinimum) {
          rowMinimum = val;
        }
      }

      if (rowMinimum < Number.MAX_VALUE) {
        if (a.label === "5" && b.label === "2") {
          console.log(rowMinimum);
        }
        sum += rowMinimum;
      }
    }

    return sum + this.getDistance(a, b);
  }

  asGraph(node) {
    let graph = [];
    let h = this.maxDepth(node);

    const printGivenLevel = (node, level) => {
      if (node === undefined) {
        return false;
      }
      if (level === 1) {
        let label = node.label;
        if (node.parent !== undefined) {
          label = `(${this.guessLocalDistance(node.parent, node)}) - ${
            node.label
          }`;
        }
        graph.push({
          group: "nodes",
          data: {
            id: node.id,
            label: label,
          },
        });
      } else if (level > 1) {
        for (var j = 0; j < node.children.length; j++) {
          printGivenLevel(node.children[j], level - 1);
          if (
            graph.find(
              (el) => el.data.id === `${node.id}_${node.children[j].id}`
            ) === undefined
          ) {
            graph.push({
              group: "edges",
              data: {
                id: `${node.id}_${node.children[j].id}`,
                source: node.id,
                target: node.children[j].id,
                label: `(${this.getDistance(node, node.children[j])}) ${
                  node.label
                },${node.children[j].label}`,
              },
            });
          }
        }
      }
    };

    for (var i = 0; i <= h; i++) {
      printGivenLevel(node, i);
    }

    return graph;
  }
}

export { TravelingSalesmanTree, TravelingSalesmanTreeNode };
