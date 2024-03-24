// Constants

const WS_WIDTH = 10;
const WS_HEIGHT = 8;

// translate these constants into CSS
document.documentElement.style.setProperty("--ws-height", WS_HEIGHT);
document.documentElement.style.setProperty("--ws-width", WS_WIDTH);
document.documentElement.style.setProperty("--ws-height-fr", `${WS_HEIGHT}fr`);
document.documentElement.style.setProperty("--ws-width-fr", `${WS_WIDTH}fr`);

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
  tiles: [
    {
      id: 0,
      name: "Water", // Not possible to extract
      under: -1, // Nothing underneath, just more water
      style: "water",
    },
    {
      id: 1,
      name: "Dirt",
      under: 2, // Rock is underneath
      style: "dirt",
    },
    {
      id: 2,
      name: "Rock",
      under: 0, // Water fills the tile when Rock is extracted
      style: "rock",      
    },
    {
      id: 3,
      name: "Tree",
      under: 1, // Dirt is underneath
      style: "tree",
    },
  ],
  tools: [
    {
      name: "Axe",
      tileId: 3, // Extracts Trees
    },
    {
      name: "Pickaxe",
      tileId: 2, // Extracts Rock
    },
    {
      name: "Shovel",
      tileId: 1, // Extracts Dirt
    },
  ],
};

const current = {
  world: [], // Is filled during InitWorld(); for future use if there are several predefined worlds to load as initial
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

  // Redraw World (tiles) part
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

    //Add required number of tiles to the row
    for (let j = 0; j < WS_WIDTH; j++) {
      const tile = createTile(rowIndex, j);
      row.appendChild(tile);
    }
    return row;

    function createTile(row, col) {
      const tile = document.createElement("div"); // .tile.box
      tile.classList.add("tile", "box");
      const logicTile = logic.tiles[current.world[row][col]];
      drawTile(tile, logicTile);
      tile.addEventListener("click", removeElement);
      // tile.dataset.id = current.world[row][col];
      return tile;
    }
  }

  // Now redraw Inventory part
  const inventoryContainer = document.querySelector("div.inventory");

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
  const item = document.createElement("div");
  item.classList.add("inv-item", "box");
  // item.innerText = "empty";
  return item;
}

function drawTile(elem, tile) {
  elem.className = tile.style;
  elem.dataset.id = tile.id;
  elem.innerText = "";
}

function removeElement(elem) {
  // from the world grid
  if (!current.tool) {
    console.log("Tool is not selected");
    return;
  }

  const tileElem = elem.currentTarget;
  const tile = logic.tiles[tileElem.dataset.id];

  if (current.tool.tileId != tile.id) {
    return; // Tool is not compatible with the terrain type
  }

  if (pushInventory(tileElem, tile) && (tile.under>=0)) {
    // remove the tile from the world;
    const newTile = logic.tiles[tile.under];
    drawTile(tileElem, newTile);
  }
}

function restoreLastElement(elem) {
  // from the inventory into the world grid
  const invElem = elem.currentTarget;
  const parent = invElem.parentNode;
  const index = [].indexOf.call(parent.children, invElem);
  const invItem = current.inventory[index];

  const tile = logic.tiles[invElem.dataset.id];
  console.log(
    `Restoring element ${tile.name} from the inventory in place ${index}`
  ); // from the inventory
  console.log(invItem.logic.name);

  drawTile(invItem.from, invItem.logic);

  pullInventory(invElem, invItem);
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

function pushInventory(elem, tile) {
  console.log(
    `Inserting into inventory: ${tile.name}, size of the inventory: ${current.inventory.length}`
  );

  if (current.inventory.length >= WS_HEIGHT) {
    alert("The Inventory is full!");
    return false;
  }

  const invItem = {
    logic: tile,
    from: elem,
  };
  current.inventory.push(invItem);

  // add the element into inventory HTML
  const inventoryContainer = document.querySelector("div.inventory");
  const inventoryElement =
    inventoryContainer.children[current.inventory.length - 1];
  drawTile(inventoryElement, tile);

  inventoryElement.addEventListener("click", restoreLastElement);

  return true; //successfully got the tile.
}

function pullInventory(elem, invItem) {
  // remove an element from HTML
  const parent = elem.parentNode;
  parent.removeChild(elem);
  const lastElem = createInventoryEmptyItem();
  parent.appendChild(lastElem);

  //remove an element from the data
  const index = current.inventory.indexOf(invItem);
  current.inventory.splice(index, 1);
}
