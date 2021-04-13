<script>
  import { tick } from "svelte";
  import { nanoid } from "nanoid/non-secure";
  import * as _ from "lodash";

  import { Node, BinTree } from "../../utils/BinTrees.js";

  import cytoscape from "cytoscape";
  import dagre from "cytoscape-dagre";
  cytoscape.use(dagre);

  let input;

  let graphTree = new BinTree();
  let graphTreeStats = {
    maxDepth: 0,
    isStrict: false,
    isBalanced: false,
    isAlmostComplete: false,
    isComplete: false,
    adtBintree: "",
    preorder: "",
    inorder: "",
    postorder: "",
  };
  let customTree = undefined;

  function treeBuilder() {
    console.log("Running Treebuilder!");
    if (customTree === undefined) {
      customTree = cytoscape({
        container: document.getElementById("treebuilder"),
        elements: [
          {
            group: "nodes",
            data: {
              id: nanoid(),
              label: "leer",
              parentNode: undefined,
              left: undefined,
              right: undefined,
            },
          },
        ],
        style: [
          {
            selector: "nodes",
            style: {
              label: function (ele) {
                return ele.data("label");
              },
              "text-justification": "center",
              "text-halign": "center",
              "text-valign": "center",
            },
          },
        ],
      });
    }

    customTree.on("tap", "node", function (evt) {
      console.log(input);
      let value = input;

      if (input !== "" && input !== undefined) {
        input = "";
        console.log(`Add ${value} to Tree: ${this.id()}`);
        let node = customTree.getElementById(this.id());
        if (node.data("label") === "leer") {
          node.data("label", value);

          for (var i = 0; i < 2; i++) {
            let direction = i === 0 ? "left" : "right";
            let newId = nanoid();
            node.data(direction, newId);
            let subtree = {
              group: "nodes",
              data: {
                id: newId,
                label: "leer",
                left: undefined,
                right: undefined,
                parentNode: this.id(),
                direction: direction,
              },
            };
            let subEdge = {
              group: "edges",
              data: {
                id: nanoid(),
                source: this.id(),
                target: newId,
              },
            };
            customTree.add(subtree);
            customTree.add(subEdge);
          }

          customTree
            .layout({
              name: "dagre",
              ranker: "network-simplex",
              rankDir: "TB",
              // align: "LR",
              animate: true,
              animationDuration: 100,
            })
            .run();

          customTree.center();
          customTree.fit();

          input = "";
          document.getElementById("input").focus();
          // console.log(customTree.elements().jsons());
          graphTree.generateFromGraph(customTree.elements().jsons());

          let root = graphTree.getRoot();

          graphTreeStats.maxDepth = graphTree.maxDepth(root);
          graphTreeStats.isStrict = graphTree.isStrict(root);
          graphTreeStats.isBalanced = graphTree.isBalanced(root);
          graphTreeStats.isAlmostComplete = graphTree.isAlmostComplete(root);
          graphTreeStats.isComplete = graphTree.isComplete(root);
          graphTreeStats.is2Balanced = graphTree.isBalanced(root, 2);
          graphTreeStats.adtBintree = graphTree.printAsBINTREE(root);
          graphTreeStats.preorder = graphTree.traverse(root, "preorder");
          graphTreeStats.inorder = graphTree.traverse(root, "inorder");
          graphTreeStats.postorder = graphTree.traverse(root, "postorder");
          console.log(graphTree);
        }
      }
    });

    customTree
      .layout({
        name: "dagre",
        ranker: "network-simplex",
        rankDir: "TB",
        align: "DL",
        animate: true,
        animationDuration: 100,
      })
      .run();

    customTree.center();
    customTree.fit();
  }

  (async function () {
    await tick();
    treeBuilder();
  })();
</script>

<h1 class="text-3xl text-gray-700">Input:</h1>
<input id="input" class="w-1/2" type="text" bind:value={input} />
<!-- Treebuilder -->
<div class="border border-gray-500 mt-2 rounded-md">
  <p class="text-center pt-2">Treebuilder</p>
  <div id="treebuilder" class="cytoscape" />
  <div class="grid gap-2 grid-cols-3">
    <span>Tiefe: {graphTreeStats.maxDepth - 1}</span>
    <span>Strikt: {graphTreeStats.isStrict}</span>
    <span>Ausgeglichen: {graphTreeStats.isBalanced}</span>
    <span>2-Balanciert: {graphTreeStats.is2Balanced}</span>
    <span>Fast vollst.: {graphTreeStats.isAlmostComplete}</span>
    <span>Vollst.: {graphTreeStats.isComplete}</span>
  </div>
  <div class="pt-2">
    <p class="text-lg">{graphTreeStats.adtBintree}</p>
  </div>
  <div class="pt-2">
    <p class="text-lg">Preorder: {graphTreeStats.preorder}</p>
    <p class="text-lg">Inorder: {graphTreeStats.inorder}</p>
    <p class="text-lg">Postorder: {graphTreeStats.postorder}</p>
  </div>
</div>

<style>
  .cytoscape {
    width: 100%;
    height: 250px;
    display: block;
  }

  #treebuilder {
    width: 100%;
    height: 600px;
    display: block;
  }
</style>
