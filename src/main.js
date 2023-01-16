import * as NC from 'nodicanvas';
let canvas = document.getElementById("nodicanvas");

export class BeatTheApe extends NC.NodiView {
    constructor(canvas) {
        super(canvas, new NC.Vec2(8, 8), 1);
        this.hud = new NC.NodiHud("hud", this);
        this.reset();
        this.maxPoint = 0;
    }

    resize() {
        let docRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
        if (docRatio > this.ratio)
            this.setScale((document.documentElement.clientHeight - 100 ) / this.size.y);
        else
            this.setScale((document.documentElement.clientWidth * 0.9 ) / this.size.x);

        this.setCenter(this.mid.x, this.mid.y);
        super.resize();
    }

    reset() {
        this.point = 0;
        this.nextNum = 1;
        this.level = 2;
        this.resize();
        this.state = "init";
    }

    startNextLevel() {
        this.level++;
        this.state = "init";

        let hudMsg = ""
        if (this.maxPoint) {
            hudMsg += "Reached " + this.maxPoint + " points. ";
        }
        if (this.hud) {
            hudMsg += "Click on 1 to start.";
        }
        this.hud.msgText = hudMsg;
        let dataLayer = this.layers["data"];
        dataLayer.d = {};
        dataLayer.datasource = [];

        for (let yFill = 0; yFill < this.gridSize.y; yFill++) {
            for (let xFill = 0; xFill < this.gridSize.x; xFill++) {
                dataLayer.datasource.push(new NC.Vec2(xFill, yFill));
            }
        }

        for (let i = 0; i < this.level; i++) {
            let itemPos = NC.getRandomInt(dataLayer.datasource.length);
            let data = dataLayer.datasource[itemPos]
            data.visible = true;
            data.id = itemPos;
            data.number = i + 1;
            let itemID = data.y * this.gridSize.x + data.x;
            dataLayer.d[itemID] = data;
            dataLayer.datasource.splice(itemPos, 1);
        }

        this.nextNum = 1;
    }

    start() {
        this.state = "running";
        this.hud.msgText = "Uncover the tiles with increasing order";
        this.nextNum = 2;
    }

}