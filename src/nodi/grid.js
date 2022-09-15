import NodiLayer from "../gui/layer.js";

export default class NodiGrid extends NodiLayer{
    constructor(gridsize, lineWidth) {
        super();
        this.CANVAS_GRID_SIZE = gridsize;
        this.setScale(gridsize);
        this.lineWidth = lineWidth;
    }

    render(view) {
        view.ctx.strokeStyle = "#555";
        let s = 1;

        let marginx = this.viewPort.width * 0.1;
        let marginy = this.viewPort.height * 0.1;
        let grid_area = [   this.viewPort.x - marginx,
                            this.viewPort.y - marginy,
                            this.viewPort.x + this.viewPort.width + 2 * marginx,
                            this.viewPort.y + this.viewPort.height + 2 * marginy];

        let l = Math.floor(grid_area[0] / s) * s;
        let t = Math.floor(grid_area[1] / s) * s + s;
        let r = grid_area[2];
        let d = grid_area[3];

        //console.log("draw grid", grid_area[0]);
        view.ctx.lineWidth = this.lineWidth;
        view.ctx.beginPath();

        for (var x = l; x <= r; x += s) {
            view.ctx.moveTo(x, t);
            view.ctx.lineTo(x, d);
        }

        for (var y = t; y <= d; y += s) {
            view.ctx.moveTo(l, y);
            view.ctx.lineTo(r, y);
        }
        view.ctx.stroke();
    }
}
