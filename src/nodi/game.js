import NodiView from "../gui/view.js";
import NodiLayer from "../gui/layer.js";
import Vec2 from "../core/vec2.js";
import NodiHud from "../gui/hud.js";

export default class NodiGame extends NodiView {
    constructor(canvas) {
      super(canvas);

      this.level = 1;
      this.state = "init";
      this.lastCell = 1;
      this.point = 0;

      super.hud = new NodiHud(this);
    }

    setGrid(grid) {
        this.grid = grid;
    }

    addHUD(hud) {
        this.hud = hud;
    }
    
    newLayer(name) {
        let layer = new NodiLayer(name);
        layer.game = this;
        this.addLayer(layer);
        return layer;
    }

    reset() {
        this.point = 0;
        this.level = 1;
    }

    startNextLevel() {
        this.state = "init";
        if (this.hud) {
            this.hud.msgText = "Click on any empty tile to start.";
        }
        let dataLayer = this.layers["data"];
        dataLayer.d = {};
        dataLayer.datasource = [];

        for(let yFill = 0; yFill < this.grid.h; yFill++) {
            for(let xFill = 0; xFill < this.grid.w; xFill++) {
                dataLayer.datasource.push(new Vec2(xFill, yFill));
            }
        }

        for(let i = 0; i < this.level + 2; i++) {
            let itemPos = Math.getRandomInt(dataLayer.datasource.length);
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
                item.visible = false;
            }
        }
        this.lastCell = 1;
    }

    coverClicked(item) {
        if (this.state == "running" && this.lastCell == item.number) {
            item.visible = true;
            this.point++;
            this.lastCell++;
        } else {
            this.point -= this.lastCell;
            if (this.point <= 0) {
                this.hud.msgText = "Game Over";
                this.reset();
                this.startNextLevel();
            } else {
                this.start();
            }
        }

        if (this.lastCell == this.level + 3) {
            this.level++;
            this.startNextLevel();
        }
    }
}