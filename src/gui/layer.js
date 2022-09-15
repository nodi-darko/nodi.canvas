import Transformation from "../core/transformation.js";

export default class NodiLayer extends Transformation {
    constructor() {
        super();
        this.viewPort = new DOMRect(4);
        this.pointerevents_method = "mouse";
    }

    attachView(view) {
        this.view = view;
        this.updateViewPort()
    }
    

    updateViewPort() {
        if (!this.view) return;
        var left = this.tx - (this.view.tx + this.view.dx);
        var top = this.ty - (this.view.ty + this.view.dy);

        this.viewPort.x = left;
        this.viewPort.y = top;
        this.viewPort.width = this.view.canvas.width * this.scale / this.view.scale;
        this.viewPort.height = this.view.canvas.height * this.scale / this.view.scale;
        //console.log("update view port layer", this.tx, this.view.tx);
    }

    render(view) {

    }
    
}

