import { nanoid } from 'nanoid/non-secure';
import * as _ from 'lodash';

class HuffmanTreeNode {
    constructor(label, count, alphabet) {
        this.id = nanoid();
        this.label = label;
        this.count = count;
        this.parent = undefined;
        this.children = [];
        this.alphabet = alphabet;
        this.code = "";
    }
}

class HuffmanTree {
    constructor(text) {
        this.root = null;
        this.alphabet = this.createAlphabet(text);
        this.text = text;
        this.occurrences = this.countOccurrences(text);
        this.encodedVersion = undefined;
    }

    countOccurrences(text) {
        let occurrences = [];
        for (var i = 0; i < this.alphabet.length; i++) {
            occurrences.push({
                character: this.alphabet[i],
                count: text.split(this.alphabet[i]).length - 1,
                firstOccurence: text.indexOf(this.alphabet[i]),
            });
        }
        return occurrences;
    }

    createAlphabet(pattern) {
        let alphabet;
        alphabet = _.uniq(pattern);
        alphabet.sort();
        return alphabet;
    }

    assignCodes() {
        const assignCodesRec = (node, prefix) => {

            if (node.children.length === 0) {
                let index = this.occurrences.findIndex(el => el.character === node.label)
                this.occurrences[index].code = node.code;
            }

            for (var i = 0; i < node.children.length; i++) {
                node.children[i].code = `${prefix}${i}`;
                assignCodesRec(node.children[i], node.children[i].code);
            }
        }

        for (var j = 0; j < this.root.children.length; j++) {
            this.root.children[j].code = `${j}`;
            assignCodesRec(this.root.children[j], j);
        }

    }

    encode(text) {
        let result = _.cloneDeep(text);
        for (var i = 0; i < this.occurrences.length; i++) {
            result = result.replaceAll(this.occurrences[i].character, `${this.occurrences[i].code} `);
        }
        return result;
    }

    create() {
        let newNodes = [];
        for (var i = 0; i < this.occurrences.length; i++) {
            newNodes.push(new HuffmanTreeNode(this.occurrences[i].character, this.occurrences[i].count, [this.occurrences[i].character]));
        }
        console.log('startnodes', newNodes);
        const createRec = (nodes) => {
            if (nodes.length === 2) {
                let newAlphabet = _.uniq([...nodes[0].alphabet, ...nodes[1].alphabet]);
                newAlphabet.sort();
                let res = new HuffmanTreeNode("", nodes[0].count + nodes[1].count, newAlphabet);
                nodes[0].parent = res;
                nodes[1].parent = res;
                res.children = [nodes[0], nodes[1]];
                res.children.sort((a, b) => {
                    let textA = a.alphabet[0].toUpperCase();
                    let textB = b.alphabet[0].toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                return res;
            }


            nodes.sort((a, b) => {
                return a.count - b.count;
            })
            let minCount = nodes[0].count;
            let copy = nodes.filter(nd => nd.count === minCount);
            console.log('minCount', minCount, 'copy.length', copy.length);


            while (copy.length !== 2) {
                if (copy.length < 2) {
                    minCount++;
                    // Need another node
                    console.log('Need Another node, choose from these:');
                    let temp = nodes.filter(nd => nd.count === minCount);
                    console.log(temp);
                    if (temp.length >= 1) {
                        if (temp.length > 1) {
                            // sort alphabetically
                            temp.sort((a, b) => {
                                let textA = a.alphabet[0].toUpperCase();
                                let textB = b.alphabet[0].toUpperCase();
                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                            })
                        }
                        copy = [...copy, temp[0]];
                    }
                }
                else if (copy.length > 2) {
                    // Multiple nodes with same length => sort alphabetically
                    copy.sort((a, b) => {
                        let textA = a.alphabet[0].toUpperCase();
                        let textB = b.alphabet[0].toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })
                    copy.splice(2, copy.length);
                }
            }


            console.log('copy.length', copy.length, copy);
            if (copy.length === 2) {
                // Exactly two nodes with minimal length => connect them
                let newAlphabet = _.uniq([...copy[0].alphabet, ...copy[1].alphabet]);
                newAlphabet.sort();
                var newParent = new HuffmanTreeNode("", copy[0].count + copy[1].count, newAlphabet);
                newParent.children = [copy[0], copy[1]];
                newParent.children.sort((a, b) => {
                    let textA = a.alphabet[0].toUpperCase();
                    let textB = b.alphabet[0].toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                copy[0].parent = newParent;
                copy[1].parent = newParent;
            }
            let next = nodes.filter(nd => nd.parent === undefined);

            console.log([newParent, ...next].sort((a, b) => a.count - b.count));
            return createRec([newParent, ...next]);

        }

        this.root = createRec(newNodes);
        this.assignCodes();
        this.encodedVersion = this.encode(this.text);
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
        let inOrderData = [];
        let h = this.maxDepth(node);

        const printGivenLevel = (node, level) => {
            if (node === undefined) {
                return false;
            }
            if (level === 1) {
                // inOrderData.push(...node.count);
                let label;
                if (node.label !== "") {
                    label = `${node.label}:${node.count}`;
                } else {
                    label = node.count;
                }
                graph.push({
                    group: "nodes",
                    data: {
                        id: node.id,
                        label: label,
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
                                label: j
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
    HuffmanTree,
    HuffmanTreeNode
}