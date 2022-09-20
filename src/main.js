import NodiGame from "./nodi/game.js"
import NodiView from "./gui/view.js"
import NodiLayer from "./gui/layer.js"
import NodiGrid from "./nodi/grid.js"

let canvas = document.getElementById("nodicanvas");

// create view
let game = new NodiGame(canvas);
let grid = new NodiGrid("grid", 12, 0.05, 16, 9)
game.setGrid(grid);
game.setCenter(grid.mid.x, grid.mid.y);
game.setScale(60);

// add custom layer
let dataLayer = game.newLayer("data");

dataLayer.render = function (view) {
    view.ctx.lineWidth = 1;
    view.ctx.font = "0.8px Arial";
    view.ctx.fillStyle = 'black';
    let n = 1;
    if (this.d) {
        for(let item in this.d) {
            this.fillText(this.d[item].number, this.d[item]);
        }
    }
}

// add custom layer
let coverLayer = game.newLayer("cover");

coverLayer.render = function (game) {
    let ctx = game.ctx;
    ctx.lineWidth = 1;
    ctx.fillStyle = 'gray';
    let data = game.layers["data"].d;
    if (data) {
        ctx.beginPath();
        for(let id in data) {
            let item = data[id];
            if (item.visible === false) {
                ctx.fillRect(item.x, item.y, 1, 1);
            }
        }
        ctx.stroke();
    }
}

coverLayer.onMouseClick = function (e) {
    if (game.state == "init") {
        game.start();
    }
}

coverLayer.onMouseDown = function (e) {
    let itemPos = e.gridY * this.view.grid.w + e.gridX;
    let item = game.layers["data"].d[itemPos];
    
    if (item) {
        game.coverClicked(item);
        return true;
    }
    else return false;
}



// redraw after resize event
window.view = game;
window.addEventListener("resize", function() { window.view.resize(); } );

game.startNextLevel();