// Constants

const WS_WIDTH = 10;
const WS_HEIGHT = 8;

const INI_WORLD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 3, 1, 1, 2, 2, 2],
  [0, 0, 1, 3, 3, 3, 2, 2, 2, 0],
  [0, 3, 3, 3, 0, 0, 0, 2, 2, 0],
  [1, 3, 3, 1, 1, 0, 0, 2, 2, 2],
  [1, 1, 3, 3, 1, 1, 0, 0, 2, 2],
  [3, 3, 3, 1, 0, 0, 0, 2, 2, 0],
  [3, 3, 1, 1, 1, 1, 2, 2, 0, 0],
];

const blocksLogic = [
  {
    id: 0,
    name: "Water", // Not possible to extract
    color: "blue",
  },
  {
    id: 1,
    name: "Dirt",
    under: 2, // Rock is underneath
    color: "brown",
  },
  {
    id: 2,
    name: "Rock",
    color: "grey",
  },
  {
    id: 3,
    name: "Tree",
    under: 1, // Dirt is underneath
    color: "green",
  },
];

const toolsLogic = [
  {
    name: "Axe",
    blockId: 3, // Extracts Trees
  },
  {
    name: "Pickaxe",
    blockId: 2, // Extracts Rock
  },
  {
    name: "Shovel",
    blockId: 1, // Extracts Dirt
  },
];

const inventory = []; // It's empty on page load.
const world = []; // Is filled during InitWorld();
let curTool; // Not selected;

// General flow
// Prepare the world
initTools();
initWorld();

//

// General functions
function initTools() {
  console.log("Init Tools");
  const ul = document.querySelector("ul.tools");
  for (let elem of ul.children) {
    elem.addEventListener("click", selectTool);
    const img = elem.firstChild; 
    toolsLogic[img.dataset.id]["HTMLElement"] = img;
  };
}

function initWorld() {
  console.log("Draw Inner Grid");

  // Redraw World (blocks) part
  const container = document.querySelector(".container");
  // Remove all previouse rows. Just in case.
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // reinit World array with initial values
  world.push(...INI_WORLD);

  // Draw required number of rows
  for (let i = 0; i < WS_HEIGHT; i++) {
    const row = createRow(i);
    container.appendChild(row);
  }

  function createRow(rowIndex) {
    const row = document.createElement("div"); // .row
    row.className = "row";

    //Add required number of blocks to the row
    for (let j = 0; j < WS_WIDTH; j++) {
      const block = createBlock(rowIndex, j);
      row.appendChild(block);
    }
    return row;

    function createBlock(row, col) {
      const block = document.createElement("div"); // .block.box
      block.className = "block";
      block.classList.add("box");
      const logic = blocksLogic[world[row][col]];
      drawBlock(block, logic);
      block.addEventListener("click", removeElement);
      return block;
    }
  }

  // Now redraw Inventory part
  const inventoryElem = document.querySelector("ul.inventory");

  // Remove all previous inventory items. Just in case.
  while (inventoryElem.firstChild) {
    inventoryElem.removeChild(inventoryElem.firstChild);
  }

  // Empty inventory array also
  inventory.splice(0);

  // Draw required number of inventory items
  for (let i = 0; i < WS_HEIGHT; i++) {
    const inv_item = createInventoryEmptyItem();
    inventoryElem.appendChild(inv_item);
  }

  function createInventoryEmptyItem() {
    const item = document.createElement("li");
    item.className = "inv-item";
    item.classList.add("box");
    item.style.backgroundColor = "lightgrey";
    item.innerText = "Empty";
    return item;
  }
}

function drawBlock(elem, logic) {
  elem.style.backgroundColor = logic.color;
  elem.innerText = logic.name;
  elem.dataset.id = logic.id;
}

function removeElement(elem) {
  const blockElem = elem.currentTarget;
  const block = blocksLogic[blockElem.dataset.id];

  if (curTool.blockId != block.id) {
    return; // Tool is not compatible with the terrain type
  }

  fillInventory(block);
}

function restoreLastElement(elem) {
  console.log("Restore element" + elem); // from the inventory
}

function selectTool(elem) {
  const toolElem = elem.currentTarget.firstChild;

  // Empty selection from previous tool
  if (curTool) {
    const curToolElem = curTool.HTMLElement;
    curToolElem.classList.remove("active");
  }

  curTool = toolsLogic[toolElem.dataset.id];
  toolElem.classList.add("active");
  console.log("Tool selected " + curTool.name);
}

function fillInventory(block) {
  console.log("Insert into inventory: " + block.name);
}
