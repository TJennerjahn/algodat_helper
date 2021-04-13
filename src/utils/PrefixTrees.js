import { nanoid } from 'nanoid/non-secure'
import * as _ from 'lodash';

class PrefixTreeNode {
    constructor() {
        this.id = nanoid()
        this.children = [];
        this.label = "";
        this.prefix = "";
        this.restArray = [];
    }
}

class PrefixTree {
    constructor(array) {
        this.array = array;
        this.array.sort();
        this.root = new PrefixTreeNode();
    }

    longestCommonPrefix(array) {
        let size = array.length;
        if (size === 0) {
            return "";
        }
        if (size === 1) {
            return array[0];
        }

        array.sort();

        let end = Math.min(array[0].length, array[size - 1].length);

        let i = 0;

        while (i < end && array[0].charAt(i) === array[size - 1].charAt(i)) {
            i++;
        }

        let pre = array[0].substring(0, i);
        return pre;
    }

    create() {
        let array = _.cloneDeep(this.array);
        array.sort();

        const createRec = (node, restArray) => {
            if (node === undefined) {
                return;
            }
            for (var i = 0; i < restArray.length; i++) {
                restArray[i] = restArray[i].substring(node.prefix.length, restArray[i].length);
            }
            restArray = _.compact(restArray);
            restArray.sort();
            while (restArray.length > 0) {
                let temp = _.cloneDeep(restArray.filter(el => el.startsWith(restArray[0][0]) === true));
                restArray = _.cloneDeep(restArray.filter(el => el.startsWith(restArray[0][0]) === false));
                let lcp = this.longestCommonPrefix(temp);
                if (lcp !== "") {
                    let newNode = new PrefixTreeNode();
                    newNode.label = `${node.label}${lcp}`
                    newNode.prefix = lcp;
                    newNode.restArray = temp;
                    node.children.push(newNode);
                    createRec(node.children[node.children.length - 1], temp);
                }
            }
        }

        createRec(this.root, array);
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

    asGraph(node) {
        let graph = [];
        let h = this.maxDepth(node);

        const printGivenLevel = (node, level) => {
            if (node === undefined) {
                return false;
            }
            if (level === 1) {
                graph.push({
                    group: "nodes",
                    data: {
                        id: node.id,
                        label: node.label
                    }
                })
            } else if (level > 1) {
                for (var j = 0; j < node.children.length; j++) {
                    printGivenLevel(node.children[j], level - 1);
                    if (graph.find((el) => el.data.id === `${node.id}_${node.children[j].id}`) === undefined) {
                        graph.push({
                            group: "edges",
                            data: {
                                id: `${node.id}_${node.children[j].id}`,
                                source: node.id,
                                target: node.children[j].id,
                                label: node.children[j].prefix
                            }
                        })
                    }
                }
            }
        }

        for (var i = 0; i <= h; i++) {
            printGivenLevel(node, i);
        }

        return graph;
    }
}

export {
    PrefixTree,
    PrefixTreeNode
}