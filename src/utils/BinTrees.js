import { nanoid } from 'nanoid/non-secure';
import * as _ from 'lodash';

class BinTree {
    constructor() {
        this.inOrderData = [];
        this.graphStructure = [];
        this.root = null;

    }

    getRoot() {
        return this.root;
    }

    addNode(data, id) {
        return new Node(data, id);
    }

    getBalanceFactor(node) {
        if (node === undefined) {
            return 0;
        }
        return this.maxDepth(node.left) - this.maxDepth(node.right);
    }

    calcBalanceFactors(node) {
        if (node === undefined) {
            return;
        }
        node.balanceFactor = this.getBalanceFactor(node);
        this.calcBalanceFactors(node.left);
        this.calcBalanceFactors(node.right);
    }

    replaceNodeById(node, id, newNode) {
        if (node === undefined) {
            return;
        }
        if (node.left !== undefined) {
            if (node.left.id === id) {
                node.left = newNode;
            }
        }
        else if (node.right !== undefined) {
            if (node.right.id === id) {
                node.right = newNode;
            }
        }

        this.replaceNodeById(node.left, id, newNode);
        this.replaceNodeById(node.right, id, newNode);
    }

    balanceOnce(id) {
        let searchResult = this.findById(id);
        let node;
        if (searchResult.hasId === true) {
            node = searchResult.currentNode;
        }
        else {
            return;
        }
        if (Math.abs(this.getBalanceFactor(node)) !== 2) {
            return false;
        }

        const rotateLeft = (rotator, child) => {
            searchResult = this.findById(rotator.id);
            let newTopNode = new Node(child.data, child.id);
            newTopNode.left = _.cloneDeep(rotator);
            newTopNode.right = _.cloneDeep(child.right);
            newTopNode.left.right = _.cloneDeep(child.left);

            node = newTopNode;
            if (searchResult.parentNode === undefined) {
                this.root = newTopNode;
            }
            else {
                console.log('searchresult', searchResult.currentNode.data);
                searchResult.currentNode.left = _.cloneDeep(newTopNode);
            }
            return `LR ${rotator.data}-${child.data}`
        }

        const rotateRight = (rotator, child) => {
            searchResult = this.findById(rotator.id);
            let newTopNode = new Node(child.data, child.id);
            newTopNode.right = _.cloneDeep(rotator);
            newTopNode.left = _.cloneDeep(child.left);
            newTopNode.right.left = _.cloneDeep(child.right);
            if (searchResult.parentNode === undefined) {
                this.root = newTopNode;
            } else {
                searchResult.parentNode.left = _.cloneDeep(newTopNode);
            }
            return `RR ${rotator.data}-${child.data}`
        }

        let v = this.maxDepth(node.left) > this.maxDepth(node.right) ? node.left : node.right;


        // Single Rotation Left(u);
        if (node.balanceFactor === -2 && (v.balanceFactor === 0 || v.balanceFactor === -1)) {
            console.log('Single rotation left');
            return rotateLeft(node, v);
        }
        // Single Rotation Right(u);
        else if (node.balanceFactor === 2 && (v.balanceFactor === 0 || v.balanceFactor === 1)) {
            console.log('Single rotation right');
            return rotateRight(node, v);
        }
        // Double Rotation Right(v) + Left(u);
        else if (node.balanceFactor === -2 && v.balanceFactor === 1) {
            console.log('Double rotation Right/Left');
            let w = this.maxDepth(v.left) > this.maxDepth(v.right) ? v.left : v.right;
            return rotateRight(v, w)
        }
        // Double Rotation Left(v) + Right(u);
        else if (node.balanceFactor === 2 && v.balanceFactor === -1) {
            console.log('Double rotation Left/Right');
            let w = this.maxDepth(v.left) > this.maxDepth(v.right) ? v.left : v.right;
            return rotateLeft(v, w);
        }
    }

    generateFromGraph(graph) {
        graph = graph
            .filter((el) => el.group === "nodes")
            .filter((el) => el.data.label !== "leer");
        console.log(graph);
        this.root = this.addNode(graph[0].data.label, graph[0].data.id);
        this.root.level = 1;

        const generateRec = (node, gr) => {
            if (node === undefined) {
                return;
            }

            let findLeft = gr.find(
                (el) => el.data.parentNode === node.id && el.data.direction === "left"
            );
            let findRight = gr.find(
                (el) => el.data.parentNode === node.id && el.data.direction === "right"
            );
            if (findLeft !== undefined) {
                node.left = this.addNode(findLeft.data.label, findLeft.data.id);
                node.left.level = node.level + 1;
            }
            if (findRight !== undefined) {
                node.right = this.addNode(findRight.data.label, findRight.data.id);
                node.right.level = node.level + 1;
            }

            generateRec(node.left, gr);
            generateRec(node.right, gr);
        }

        generateRec(this.root, graph);

    }

    generateFromArray(array, treeType) {
        if (array.length === 0) {
            return;
        }
        if (treeType === "levelOrder") {
            this.root = this.addNode(array[0], nanoid());
            this.root = this.insertLevelOrder(array, this.root, 0);
        }
    }

    insertLevelOrder(array, node, i) {
        let result;
        if (i < array.length) {
            let temp = this.addNode(array[i], nanoid());
            result = temp;

            result.left = this.insertLevelOrder(
                array,
                result.left,
                Math.floor(2 * i + 1)
            );
            result.right = this.insertLevelOrder(
                array,
                result.right,
                Math.floor(2 * i + 2)
            );
        }
        return result;
    }

    printAsBINTREE(node) {
        if (node === undefined) {
            return "0";
        }
        return `BUILD(${this.printAsBINTREE(node.left)}, ${node.data
            }, ${this.printAsBINTREE(node.right)})`;
    }

    traverse(node, direction) {
        if (direction === "preorder") {
            this.preorder = function (inputNode) {
                if (inputNode === undefined) {
                    return "";
                }
                if (inputNode.left !== undefined && inputNode.right !== undefined) {
                    return `${inputNode.data} ${this.preorder(inputNode.left)} ${this.preorder(
                        inputNode.right
                    )}`;
                } else if (inputNode.left !== undefined && inputNode.right === undefined) {
                    return `${inputNode.data} ${this.preorder(inputNode.left)}`;
                } else if (inputNode.left === undefined && inputNode.right !== undefined) {
                    return `${inputNode.data} ${this.preorder(inputNode.right)}`;
                } else {
                    return `${inputNode.data}`;
                }
            };

            return this.preorder(node);
        } else if (direction === "inorder") {
            this.inorder = function (inputNode) {
                if (inputNode === undefined) {
                    return "";
                }
                if (inputNode.left !== undefined && inputNode.right !== undefined) {
                    return `${this.inorder(inputNode.left)} ${inputNode.data} ${this.inorder(
                        inputNode.right
                    )}`;
                } else if (inputNode.left !== undefined && inputNode.right === undefined) {
                    return `${this.inorder(inputNode.left)} ${inputNode.data}`;
                } else if (inputNode.left === undefined && inputNode.right !== undefined) {
                    return `${inputNode.data} ${this.inorder(inputNode.right)}`;
                } else {
                    return `${inputNode.data}`;
                }
            };
            return this.inorder(node);
        } else if (direction === "postorder") {
            this.postorder = function (inputNode) {
                if (inputNode === undefined) {
                    return "";
                }
                if (inputNode.left !== undefined && inputNode.right !== undefined) {
                    return `${this.postorder(inputNode.left)} ${this.postorder(
                        inputNode.right
                    )} ${inputNode.data}`;
                } else if (inputNode.left !== undefined && inputNode.right === undefined) {
                    return `${this.postorder(inputNode.left)} ${inputNode.data}`;
                } else if (inputNode.left === undefined && inputNode.right !== undefined) {
                    return `${this.postorder(inputNode.right)} ${inputNode.data}`;
                } else {
                    return `${inputNode.data}`;
                }
            };
            return this.postorder(node);
        }
    }

    add(data) {
        // If root exists, then recursively find the place to add the new node
        if (this.root) {
            this.recursiveAddNode(this.root, null, data);
        } else {
            // If not, the add the element as a root
            this.root = this.addNode(data);
            return;
        }
    }

    findById(id) {
        const findRecursively = (node = this.root, parent = undefined) => {
            if (node === undefined) {
                return {
                    hasVal: false,
                    currentNode: undefined,
                    parentNode: undefined,
                }
            }
            if (node.id === id) {
                return {
                    hasId: true,
                    currentNode: node,
                    parentNode: parent,
                }
            } else {
                let res = findRecursively(node.left, node);
                if (res.hasId === false) {
                    res = findRecursively(node.right, node);
                }
                return res;
            }
        };

        let result = findRecursively();
        return result;
        // if (result.hasId === true) {
        //     return result.currentNode;
        // }
    }

    find(val) {
        let response = {
            hasVal: false,
            currentNode: undefined,
            parentNode: undefined,
        };
        const findRecursively = (node = this.root, parent = undefined) => {
            if (node.data === val) {
                response.hasVal = true;
                response.currentNode = node;
                response.parentNode = parent;
            } else if (node.left && node.data > val) {
                findRecursively(node.left, node);
            } else if (node.right && node.data < val) {
                findRecursively(node.right, node);
            }
        };

        findRecursively();
        return response;
    }

    delete(val) {
        if (!this.root) {
            return undefined;
        } else {
            let findNode = this.find(val);
            if (findNode.hasVal) {
                if (!findNode.currentNode.left && !findNode.currentNode.right) {
                    const direction = findNode.parentNode.data > val ? "left" : "right";
                    findNode.parentNode[direction] = undefined;
                    this[length]--;
                } else if (
                    !!findNode.currentNode.left ^ !!findNode.currentNode.right
                ) {
                    const parentToCurNodeDir =
                        findNode.parentNode.data > val ? "left" : "right";
                    const curNodeToChildDir = findNode.currentNode.left
                        ? "left"
                        : "right";
                    findNode.parentNode[parentToCurNodeDir] =
                        findNode.currentNode[curNodeToChildDir];
                    this[length]--;
                } else if (findNode.currentNode.left && findNode.currentNode.right) {
                    // find successor
                    const successor = this.findMin(findNode.currentNode.right).subtree
                        .data;
                    this.delete(successor);
                    findNode.currentNode.data = successor;
                }
            } else {
                console.log("Node not found");
            }
        }
    }

    findMin(subtree) {
        let parent;
        while (subtree.left) {
            parent = subtree;
            subtree = subtree.left;
        }
        return { subtree, parent };
    }

    minValue(node) {
        var minv = node.data;
        while (node.left !== undefined) {
            minv = node.left.data;
            node = node.left;
        }
        return minv;
    }

    recursiveAddNode(node, prevNode, data) {
        if (!node) {
            var newNode = this.addNode(data);
            return newNode;
        } else {
            if (data <= node.getData()) {
                node.left = this.recursiveAddNode(node.left, node, data);
            } else {
                node.right = this.recursiveAddNode(node.right, node, data);
            }
            return node;
        }
    }

    maxDepth(node) {
        if (node === undefined || !node) {
            return 0;
        } else {
            let lDepth = this.maxDepth(node.left);
            let rDepth = this.maxDepth(node.right);

            if (lDepth > rDepth) {
                return lDepth + 1;
            } else {
                return rDepth + 1;
            }
        }
    }

    isStrict(node) {
        if (node === undefined) {
            return true;
        }
        if (node.left && node.right) {
            return this.isStrict(node.left) && this.isStrict(node.right);
        } else if (node.left === undefined && node.right === undefined) {
            return true;
        } else {
            return false;
        }
    }

    isBalanced(node, factor = 1) {
        if (node === undefined) {
            return true;
        }
        let leftDepth = 0;
        let rightDepth = 0;
        if (node.left !== undefined) {
            leftDepth = this.maxDepth(node.left);
        }
        if (node.right !== undefined) {
            rightDepth = this.maxDepth(node.right);
        }
        if (Math.abs(leftDepth - rightDepth) <= factor) {
            return this.isBalanced(node.left) && this.isBalanced(node.right);
        } else {
            return false;
        }
    }

    isAlmostComplete(node) {
        if (node === undefined) {
            return true;
        }
        if (this.isBalanced(node) === false) {
            return false;
        }
        if (node.left === undefined && node.right === undefined) {

        }
        if (node.left === undefined && node.right !== undefined) {
            return false;
        }
        return (
            this.isAlmostComplete(node.left) && this.isAlmostComplete(node.right)
        );

    }

    isComplete(node) {
        let maxDepth = this.maxDepth(node);
        let nodeCount = this.printLevelOrder(node).length;
        return (Math.pow(2, maxDepth) - 1 === nodeCount);
    }

    printLevelOrder(node) {
        this.inOrderData = [];
        let h = this.maxDepth(node);

        const printGivenLevel = (levelNode, level) => {
            if (levelNode === undefined) {
                return false;
            }
            if (level === 1) {
                console.log(levelNode.data);
                this.inOrderData.push(levelNode.data);
                this.graphStructure.push({
                    group: "nodes",
                    data: {
                        id: levelNode.id,
                        label: levelNode.data,
                        balanceFactor: levelNode.balanceFactor
                    },
                });
            } else if (level > 1) {
                printGivenLevel(levelNode.left, level - 1);
                if (levelNode.left !== undefined) {
                    if (
                        this.graphStructure.find(
                            (el) => el.data.id === `${levelNode.id}_${levelNode.left.id}`
                        ) === undefined
                    ) {
                        this.graphStructure.push({
                            group: "edges",
                            data: {
                                // id: `${node.id}_${node.left.id}`,
                                id: `${levelNode.id}_${levelNode.left.id}`,
                                source: levelNode.id,
                                target: levelNode.left.id,
                            },
                        });
                    }
                }

                printGivenLevel(levelNode.right, level - 1);
                if (levelNode.right !== undefined) {
                    if (
                        this.graphStructure.find(
                            (el) => el.data.id === `${levelNode.id}_${levelNode.right.id}`
                        ) === undefined
                    ) {
                        this.graphStructure.push({
                            group: "edges",
                            data: {
                                // id: `${node.id}_${node.right.id}`,
                                id: `${levelNode.id}_${levelNode.right.id}`,
                                source: levelNode.id,
                                target: levelNode.right.id,
                            },
                        });
                    }
                }
            }
        }

        for (var i = 0; i <= h; i++) {
            printGivenLevel(node, i);
        }
        return this.inOrderData;
    }

    asGraph(node) {
        this.graphStructure = [];
        this.printLevelOrder(node);
        return this.graphStructure;
    }
}

class Node {
    constructor(data, id) {
        this.left = undefined;
        this.right = undefined;
        this.data = data;
        this.balanceFactor = undefined;
        this.level = 1;
        if (id === undefined) {
            this.id = nanoid();
        } else {
            this.id = id;
        }
    }

    getData() {
        return this.data;
    }

    getBalanceFactor() {
        return this.balanceFactor;
    }
}


export {
    BinTree,
    Node
}