import NodiLayer from "../gui/layer.js";

export default class NodiHud extends NodiLayer {
    constructor(game) {
        super();
        this.game = game;
    }

    render() {
        let ctx = this.game.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.font = "20px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText(parseInt(this.game.point), 30, 30);
    }
    
}

