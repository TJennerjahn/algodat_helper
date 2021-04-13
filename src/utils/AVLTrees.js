import { nanoid } from 'nanoid/non-secure'
import * as _ from 'lodash';

class AVLTreeNode {
    constructor() {
        this.id = nanoid();
        this.value = undefined;
        this.left = undefined;
        this.right = undefined;
        this.parent = undefined;
        this.balanceFactor = 0;
    }
}

class AVLTree {
    constructor() {
        this.root = new AVLTreeNode();
        this.newestNode = undefined;
        this.deletedParent = undefined;
    }

    findMin(node) {
        if (node === undefined) {
            return;
        }

        let result = node;
        while (result.left !== undefined) {
            result = result.left;
        }

        return result;
    }

    remove(input) {
        const removeRec = (node, value) => {
            console.log('removerec called', value);
            if (node === undefined) {
                return;
            }
            if (value === node.value) {
                // Found the correct node
                console.log('node to delete', node);
                if (node.left === undefined && node.right === undefined) {
                    this.deletedParent = node.parent;
                    if (node.parent === undefined) {
                        this.root = new AVLTreeNode();
                        return;
                    }
                    if (value > node.parent.value) {
                        // Leaf is the right subtree
                        node.parent.right = undefined;
                    }
                    else if (value < node.parent.value) {
                        node.parent.left = undefined;
                    }
                }
                else {
                    if (node.left !== undefined && node.right !== undefined) {
                        // Node to be deleted is inner node with subtrees on both sides
                        // Find min in right subtree (alternative is find max in left subtree)
                        let min = this.findMin(node.right);
                        if (min.value < min.parent.value) {
                            min.parent.left = undefined
                        }
                        else if (min.value > min.parent.value) {
                            min.parent.right = undefined;
                        }
                        console.log('min', min);
                        // this.deletedParent = min.parent;
                        if (node.parent === undefined) {
                            this.root = min;
                            this.deletedParent = min.parent;
                            min.parent = undefined;
                        }
                        else if (node.value < node.parent.value) {
                            // node to be deleted is in left subtree
                            node.parent.left = min;
                        }
                        else if (node.value > node.parent.value) {
                            // node to be deleted is in left subtree
                            node.parent.right = min;
                        }
                        min.left = node.left;
                        min.right = node.right;
                    }
                    else if (node.left !== undefined) {
                        if (node.value < node.parent.value) {
                            // Node to be deleted is left subtree
                            node.parent.left = node.left;
                            node.left.parent = node.parent;
                        }
                        else if (node.value > node.parent.value) {
                            // Node to be deleted is right subtree
                            node.parent.right = node.left;
                            node.left.parent = node.parent;
                        }
                        this.deletedParent = node.left;
                    }
                    else if (node.right !== undefined) {
                        if (node.value < node.parent.value) {
                            // Node to be deleted is left subtree
                            node.parent.left = node.right;
                            node.right.parent = node.parent;
                        }
                        else if (node.value > node.parent.value) {
                            // Node to be deleted is right subtree
                            node.parent.right = node.right;
                            node.right.parent = node.parent;
                        }
                        this.deletedParent = node.right;
                    }
                }
            }
            else {
                if (value < node.value) {
                    removeRec(node.left, value);
                }
                else if (value > node.value) {
                    removeRec(node.right, value);
                }
            }
        }

        removeRec(this.root, input);
        this.resetParents();
        this.calcBalanceFactorsDownwards(this.root);
    }

    add(input) {

        const addRec = (node, value) => {
            if (node === this.root && this.root.value === undefined) {
                this.root.value = value;
                return;
            }
            if (node === undefined) {
                return
            }
            if (value < node.value) {
                if (node.left === undefined) {
                    let newNode = new AVLTreeNode();
                    newNode.value = value;
                    newNode.parent = node;
                    node.left = newNode;
                    this.newestNode = node.left;
                }
                else {
                    addRec(node.left, value);
                }
            }
            else if (value > node.value) {
                if (node.right === undefined) {
                    let newNode = new AVLTreeNode();
                    newNode.value = value;
                    newNode.parent = node;
                    node.right = newNode;
                    this.newestNode = node.right;
                }
                else {
                    addRec(node.right, value);
                }
            }
            else {
                // value already exists => find and return node
            }
        }

        addRec(this.root, input);
        this.calcBalanceFactorsDownwards(this.root);
    }

    resetParents() {
        const resetParentsRec = (node, parent) => {
            if (node === undefined) {
                return;
            }
            node.parent = parent;
            resetParentsRec(node.left, node);
            resetParentsRec(node.right, node);
        }

        resetParentsRec(this.root.left, this.root);
        resetParentsRec(this.root.right, this.root);
    }

    balance(node) {

        const rebalance = (unbalancedNode) => {
            let relevantSubTree = (unbalancedNode.balanceFactor < 0 ? unbalancedNode.right : unbalancedNode.left);

            const rotateLeft = (unbalancedNode, relevantSubTree) => {
                console.log("Single left rotation", unbalancedNode.value, relevantSubTree.value);
                let temp = _.cloneDeep(relevantSubTree.left);
                relevantSubTree.left = unbalancedNode;
                if (unbalancedNode.parent !== undefined) {
                    relevantSubTree.parent = unbalancedNode.parent;
                    if (unbalancedNode.parent.left === unbalancedNode) {
                        unbalancedNode.parent.left = relevantSubTree;
                    }
                    else if (unbalancedNode.parent.right === unbalancedNode) {
                        unbalancedNode.parent.right = relevantSubTree;
                    }
                    // unbalancedNode.parent = relevantSubTree;
                }
                else {
                    relevantSubTree.parent = undefined;
                    this.root = relevantSubTree;
                }
                unbalancedNode.parent = relevantSubTree;
                unbalancedNode.right = temp;
                return `LR ${unbalancedNode.value}-${relevantSubTree.value}`
            }

            const rotateRight = (unbalancedNode, relevantSubTree) => {
                console.log("Single right rotation", unbalancedNode.value, relevantSubTree.value);
                let temp = _.cloneDeep(relevantSubTree.right);
                relevantSubTree.right = unbalancedNode;
                if (unbalancedNode.parent !== undefined) {
                    relevantSubTree.parent = unbalancedNode.parent;
                    if (unbalancedNode.parent.left === unbalancedNode) {
                        unbalancedNode.parent.left = relevantSubTree;
                    }
                    else if (unbalancedNode.parent.right === unbalancedNode) {
                        unbalancedNode.parent.right = relevantSubTree;
                    }
                    // unbalancedNode.parent = relevantSubTree;
                }
                else {
                    relevantSubTree.parent = undefined;
                    this.root = relevantSubTree;
                }

                unbalancedNode.parent = relevantSubTree;
                unbalancedNode.left = temp;
                return `RR ${unbalancedNode.value}-${relevantSubTree.value}`
            }

            if (unbalancedNode.balanceFactor === -2 && relevantSubTree.balanceFactor <= 0) {
                // Single left rotation
                return rotateLeft(unbalancedNode, relevantSubTree);
            }
            else if (unbalancedNode.balanceFactor === 2 && relevantSubTree.balanceFactor >= 0) {
                // Single right rotation
                return rotateRight(unbalancedNode, relevantSubTree);

            } else if (unbalancedNode.balanceFactor === -2 && relevantSubTree.balanceFactor === 1) {
                // Double Rotation Right(subtree) + Left(node)
                unbalancedNode = relevantSubTree;
                relevantSubTree = (unbalancedNode.balanceFactor < 0 ? unbalancedNode.right : unbalancedNode.left);
                return rotateRight(unbalancedNode, relevantSubTree);
            }
            else if (unbalancedNode.balanceFactor === 2 && relevantSubTree.balanceFactor === -1) {
                // Double Rotation Left(subtree) + Right(node)
                unbalancedNode = relevantSubTree;
                relevantSubTree = (unbalancedNode.balanceFactor < 0 ? unbalancedNode.right : unbalancedNode.left);
                return rotateLeft(unbalancedNode, relevantSubTree);
            }

        }

        if (node === undefined) {
            return false;
        }
        if (Math.abs(node.balanceFactor) !== 2) {
            return this.balance(node.parent);
        } else {
            // Found the node that needs rebalancing
            let result = rebalance(node);
            this.resetParents();
            this.calcBalanceFactorsDownwards(this.root);
            return result;
        }
    }

    censor(key, value) {
        if (key == "parent") {
            return undefined;
        }
        return value;
    }

    calcBalanceFactorsDownwards(node) {
        if (node === undefined) {
            return;
        }
        node.balanceFactor = this.getBalanceFactor(node);
        this.calcBalanceFactorsDownwards(node.left);
        this.calcBalanceFactorsDownwards(node.right);
    }

    getBalanceFactor(node) {
        if (node === undefined) {
            return 0;
        }
        return this.maxDepth(node.left) - this.maxDepth(node.right);
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

    printLevelOrder(node) {
        this.inOrderData = [];
        let h = this.maxDepth(node);

        const printGivenLevel = (levelNode, level) => {
            if (levelNode === undefined) {
                return false;
            }
            if (level === 1) {
                this.inOrderData.push(levelNode.value);
                this.graphStructure.push({
                    group: "nodes",
                    data: {
                        id: levelNode.id,
                        label: levelNode.value,
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

export {
    AVLTree,
    AVLTreeNode
}