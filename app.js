// Constants

const WS_WIDTH = 10;
const WS_HEIGHT = 8;

const INI_WORLD = [
  // Initial state of the world
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 3, 1, 1, 2, 2, 2],
  [0, 0, 1, 3, 3, 3, 2, 2, 2, 0],
  [0, 3, 3, 3, 0, 0, 0, 2, 2, 0],
  [1, 3, 3, 1, 1, 0, 0, 2, 2, 2],
  [1, 1, 3, 3, 1, 1, 0, 0, 2, 2],
  [3, 3, 3, 1, 0, 0, 0, 2, 2, 0],
  [3, 3, 1, 1, 1, 1, 2, 2, 0, 0],
];

const logic = {
  blocks: [
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
  ],
  tools: [
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
  ],
};

const current = {
  world: [], // Is filled during InitWorld();
  inventory: [], // It's empty on page load.
  tool: null, // Not selected;
};

// Prepare the world
initTools();
initWorld();
initResetButton();

// General functions
function initTools() {
  console.log("Init Tools");
  const ul = document.querySelector("ul.tools");
  for (let elem of ul.children) {
    elem.addEventListener("click", selectTool);
    const img = elem.firstChild;
    logic.tools[img.dataset.id]["HTMLElement"] = img;
  }
}

function initResetButton() {
  const button = document.querySelector("input.reset");
  button.addEventListener("click", initWorld);
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
  current.world.push(...INI_WORLD);

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
      const logicBlock = logic.blocks[current.world[row][col]];
      drawBlock(block, logicBlock);
      block.addEventListener("click", removeElement);
      return block;
    }
  }

  // Now redraw Inventory part
  const inventoryContainer = document.querySelector("ul.inventory");

  // Remove all previous inventory items. Just in case.
  while (inventoryContainer.firstChild) {
    inventoryContainer.removeChild(inventoryContainer.firstChild);
  }

  // Empty inventory array also
  current.inventory.splice(0);

  // Draw required number of inventory items
  for (let i = 0; i < WS_HEIGHT; i++) {
    const inv_item = createInventoryEmptyItem();
    inventoryContainer.appendChild(inv_item);
  }
}

function createInventoryEmptyItem() {
  const item = document.createElement("li");
  item.className = "inv-item";
  item.classList.add("box");
  item.style.backgroundColor = "lightgrey";
  item.innerText = "Empty";
  return item;
}

function drawBlock(elem, block) {
  elem.style.backgroundColor = block.color;
  elem.innerText = block.name;
  elem.dataset.id = block.id;
}

function removeElement(elem) {
  if (!current.tool) {
    console.log("Tool is not selected");
    return;
  }

  const blockElem = elem.currentTarget;
  const block = logic.blocks[blockElem.dataset.id];

  if (current.tool.blockId != block.id) {
    return; // Tool is not compatible with the terrain type
  }

  if (pushInventory(block) && block.under) {
    // remove the block from the world;
    const newBlock = logic.blocks[block.under];
    drawBlock(blockElem, newBlock);
  }
}

function restoreLastElement(elem) {
  const invElem = elem.currentTarget;
  const block = logic.blocks[invElem.dataset.id];
  console.log(
    `Restoring element ${block.name} from the inventory in place ???`
  ); // from the inventory

  pullInventory(invElem, block);
}

function selectTool(elem) {
  const toolElem = elem.currentTarget.firstChild;

  // Empty selection from previous tool
  if (current.tool) {
    const curToolElem = current.tool.HTMLElement;
    curToolElem.classList.remove("active");
  }

  current.tool = logic.tools[toolElem.dataset.id];
  toolElem.classList.add("active");
  console.log("Tool selected " + current.tool.name);
}

function pushInventory(block) {
  console.log(
    `Inserting into inventory: ${block.name}, size of the inventory: ${current.inventory.length}`
  );

  if (current.inventory.length >= WS_HEIGHT) {
    alert("The Inventory is full!");
    return false;
  }

  current.inventory.push(block);

  // add the element into inventory HTML
  const inventoryContainer = document.querySelector("ul.inventory");
  const inventoryItem =
    inventoryContainer.children[current.inventory.length - 1];
  drawBlock(inventoryItem, block);

  inventoryItem.addEventListener("click", restoreLastElement);

  return true; //successfully got the block.
}

function pullInventory(elem, block) {
  // remove an element from HTML
  const parent = elem.parentNode;
  parent.removeChild(elem);
  const lastElem = createInventoryEmptyItem();
  parent.appendChild(lastElem);

  //remove an element from the data
  const index = current.inventory.indexOf(block);
  current.inventory.splice(index, 1);
}
