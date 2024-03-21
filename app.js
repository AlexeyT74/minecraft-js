// World Size, in blocks:
const WS_WIDTH = 10;
const WS_HEIGHT = 8;

// General flow

// Prepare the world
drawInnerGrid();
initWorld();

// Register event handlers
registerEventHandlers();

// 


// General functions
function drawInnerGrid(){
    // Only once, when the page is initialized
    console.log("Draw Inner Grid");

    const container = document.querySelector(".container");
    // Remove all previouse rows. Just in case.
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let i=0; i<WS_HEIGHT; i++){
        const row = createRow();
        container.appendChild(row);
    }

    function createRow(){
        const row = document.createElement("div"); // .row
        row.className = "row"
        for(let j=0; j<WS_WIDTH; j++){
            const col = createCol();
            row.appendChild(col);
        }
        return row;

        function createCol(){ // By default it is a water block;
            const col = document.createElement("div"); // .block.box
            col.className = "block";
            col.classList.add("box");
            col.style.backgroundColor = "blue";
            col.innerText = "Water"
            return col;
        }
    }
}

function initWorld(){
    // During initial page load and during Reset. 
    console.log("Init World");
}

function removeElement(elem){
    console.log("Remove element"+elem);
}

function restoreLastElement(elem){
    console.log("Restore element"+elem); // from the inventory
}

function registerEventHandlers(){

}
