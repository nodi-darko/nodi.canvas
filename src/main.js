import * as NODICANVAS from 'nodicanvas';
let canvas = document.getElementById("nodicanvas");

class BeatTheApe extends NODICANVAS.NodiView {
    constructor(canvas) {
        super(canvas);
        this.lastCell = 1;
        this.grid = new NODICANVAS.NodiGrid("grid", 1, 0.05, 8, 5);
        this.hud = new NODICANVAS.NodiHud(this);
        this.addLayer(this.grid);
        this.addLayer(this.hud);
        this.reset();
    }

    resize() {
        let docRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
        if (docRatio > this.grid.ratio)
            this.setScale((document.documentElement.clientHeight - 100 ) / this.grid.size.y);
        else
            this.setScale((document.documentElement.clientWidth * 0.9 ) / this.grid.size.x);

        this.setCenter(this.grid.mid.x, this.grid.mid.y);
        super.resize();
    }

    reset() {
        this.point = 0;
        this.level = 1;
        this.resize();
    }

    startNextLevel() {
        this.state = "init";
        if (this.hud) {
            this.hud.msgText = "Click on number 1 to start.";
        }
        let dataLayer = this.layers["data"];
        dataLayer.d = {};
        dataLayer.datasource = [];

        for(let yFill = 0; yFill < this.grid.h; yFill++) {
            for(let xFill = 0; xFill < this.grid.w; xFill++) {
                dataLayer.datasource.push(new NODICANVAS.Vec2(xFill, yFill));
            }
        }

        for(let i = 0; i < this.level + 2; i++) {
            let itemPos = NODICANVAS.getRandomInt(dataLayer.datasource.length);
            let data = dataLayer.datasource[itemPos]
            data.visible = true;
            data.id = itemPos;
            data.number = i + 1;
            let itemID = data.y * this.grid.w + data.x;
            dataLayer.d[itemID] = data;
            dataLayer.datasource.splice(itemPos, 1);
        }
    }

    start() {
        this.state = "running";
        this.hud.msgText = "Uncover the tiles with increasing order";
        let data = this.layers["data"].d;
        if (data) {
            for(let id in data) {
                let item = data[id];
                if (item.number !== 1) item.visible = false;
            }
        }
        this.lastCell = 2;
    }

    coverClicked(item) {
        if (this.state == "init" && item.number == 1) {
            this.start();
            item.visible = true;
            return;
        }
        
        if (this.state == "running" && this.lastCell == item.number) {
            item.visible = true;
            this.point++;
            this.lastCell++;

            if (this.lastCell == this.level + 3) {
                this.level++;
                this.startNextLevel();
                return;
            }
            return;
        } 

        if (this.state == "running" && this.lastCell != item.number) {
            this.point -= this.lastCell;
            if (this.point <= 0) {
                this.hud.msgText = "Game Over";
                this.reset();
                this.startNextLevel();
            }
            return;
        }


    }
}
// create view
let game = new BeatTheApe(canvas);

// add custom layer
let dataLayer = game.newLayer("data");

dataLayer.render = function (view) {
    view.ctx.lineWidth = 1;
    view.ctx.font = "0.8px Arial";
    view.ctx.fillStyle = 'black';
    view.ctx.textAlign = 'center';
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

/*coverLayer.onMouseClick = function (e) {
    if (game.state == "init") {
        game.start();
    }
}*/

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
window.addEventListener("load", function() { window.view.resize(); } );

window.view.resize();
game.startNextLevel();