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

        ctx.fillText("score: " + parseInt(this.game.point), 30, 30);

        if (this.msgText) {
            ctx.fillText(this.msgText, (this.game.viewPort.right - ctx.measureText(this.msgText).width) / 2, 30);
        }
    }

    showMsg(msg) {
        this.msgText = msg[0];
        setTimeout(this.removeText, msg[1], this);
    }

    removeText(hud) {
        hud.msgText = undefined;
    }
    
}

