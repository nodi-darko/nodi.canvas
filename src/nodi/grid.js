import Vec2 from "../core/vec2.js";
import NodiLayer from "../gui/layer.js";

export default class NodiGrid extends NodiLayer{
    constructor(name, gridSize, lineWidth, w, h) {
        super(name);
        this.gridSize = gridSize;
        this.lineWidth = lineWidth;
        this.w = w;
        this.h = h;
        this.setScale(this.gridSize);
        this.mid = new Vec2(this.w, this.h).divide(2);
    }

    worldToGrid(x, y) {
        return new Vec2(Math.floor(x / this.gridSize), Math.floor(y / this.gridSize));
    }

    screenToGrid(x, y) {
        return this.worldToGrid(x, y);
    }

    render(view) {
        view.ctx.strokeStyle = "#555";
        let marginx = this.viewPort.width * 0.1;
        let marginy = this.viewPort.height * 0.1;
        let left = 0, top = 0, right, down;

        if (this.w == 0 || this.w == undefined) {
            left = Math.floor(this.viewPort.x - marginx);
            right = left + this.viewPort.width + 2 * marginx;
        } else {
            right = this.w;
        }
        if (this.h == 0 || this.h == undefined) {
            top = Math.floor(this.viewPort.y - marginy);
            down = top + this.viewPort.height + 2 * marginy;
        } else {
            down = this.h;
        }

        //console.log("draw grid", grid_area[0]);
        view.ctx.lineWidth = this.lineWidth;
        view.ctx.beginPath();

        for (var x = left; x <= right; x += 1) {
            view.ctx.moveTo(x, top);
            view.ctx.lineTo(x, down);
        }

        for (var y = top; y <= down; y += 1) {
            view.ctx.moveTo(left, y);
            view.ctx.lineTo(right, y);
        }
        view.ctx.stroke();
    }
}
