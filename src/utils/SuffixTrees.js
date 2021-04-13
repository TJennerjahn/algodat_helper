import { nanoid } from 'nanoid/non-secure'
import * as _ from 'lodash';

class SuffixTreeNode {
    constructor(alphabet, suffixes, label) {
        this.id = nanoid();
        this.label = label;
        this.children = [];
        this.values = [];
        this.alphabet = alphabet;
        this.suffixes = suffixes;
    }
}

class SuffixTree {
    constructor(pattern) {
        let alphabet = this.createAlphabet(pattern);
        let suffixes = this.createSuffixes(pattern);
        this.root = new SuffixTreeNode(alphabet, suffixes, "");
    }

    createAlphabet(pattern) {
        let alphabet;
        alphabet = _.uniq(pattern);
        alphabet.sort();
        return alphabet;
    }

    createSuffixes(pattern) {
        let suffixArray = [];
        for (var i = 0; i < pattern.length; i++) {
            let suffix = pattern.slice(i, pattern.length);
            suffixArray.push(suffix);
        }
        return suffixArray;
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

    createRec(node) {
        if (node === null || node === undefined || node.suffixes.length === 0) {
            return
        }
        for (var i = 0; i < node.alphabet.length; i++) {
            let array = node.suffixes.filter(el => el[0] === node.alphabet[i]);
            if (array.length === 0) {
                continue;
            }
            let lcp = this.longestCommonPrefix(array);
            let longest = array.reduce((a, b) => { return a.length > b.length ? a : b });
            let newNode = new SuffixTreeNode(this.createAlphabet(longest), [], lcp);
            for (var j = 0; j < array.length; j++) {
                let sub = array[j].substring(lcp.length, array[j].length);
                if (sub.length > 0) {
                    newNode.suffixes.push(sub);
                }

            }
            node.children.push(newNode);
        }

        for (var i = 0; i < node.children.length; i++) {
            this.createRec(node.children[i]);
        }

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
                        label: ""
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
                                label: node.children[j].label
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

    add(values, node = this.root) {
        node.children.push(new SuffixTreeNode(values, nanoid()));
    }

}

export {
    SuffixTree,
    SuffixTreeNode
}