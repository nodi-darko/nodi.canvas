import Vec2 from "./vec2.js";

export default class Transformation {
    constructor(limits) {
        this.sx = 1;
        this.sy = this.sx;
        this.tx = 0;
        this.ty = 0;
        this.dx = 0;
        this.dy = 0;

        this.scale = this.sx;
        if (limits?.length) this.max_scale = limits[0];
        if (limits?.length) this.min_scale = limits[1];
        this.enabled = true;
        this.element = null;
    }


    toWorld(pos) {
        return new Vec2(  (pos.x + this.tx) * this.scale,
                      (pos.y + this.ty) * this.scale);
    }

    toCanvas(pos) {
        return new Vec2( this.tx + pos.x / this.scale,
                         this.ty + pos.y / this.scale);
    }

    setTranslate(x, y) {
        this.tx = x;
        this.ty = y;
    }

    setScale(value, zooming_center) {
        if (this.min_scale != null && value < this.min_scale) {
            value = this.min_scale;
        } else if (this.max_scale != null && value > this.max_scale) {
            value = this.max_scale;
        }

        if (value == this.scale) {
            return;
        }

        this.scale = value;

        if(zooming_center) {
            var center = this.toCanvas(zooming_center);
            this.scale = value;
            if (Math.abs(this.scale - 1) < 0.01) {
                this.scale = 1;
            }

            var new_center = this.toCanvas(zooming_center);
            var delta_offset = new Vec2(new_center[0] - center[0], new_center[1] - center[1]);


            this.tx += delta_offset.x;
            this.ty += delta_offset.y;
        }
        this.sx = this.sy = this.scale;
    }

    changeDeltaScale(value, zooming_center) {
        this.setScale(this.scale * value, zooming_center);
    }

    reset() {
        this.scale = 1;
        this.tx = 0;
        this.ty = 0;
    }
}