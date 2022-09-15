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


    convertOffsetToCanvas(pos) {
        return [
            (pos[0] + this.tx) * this.scale,
            (pos[1] + this.ty) * this.scale
        ];
    }

    convertCanvasToOffset(pos, out) {
        out = out || [0, 0];
        out[0] = pos[0] / this.scale - this.tx;
        out[1] = pos[1] / this.scale - this.ty;
        return out;
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
            var center = this.convertCanvasToOffset(zooming_center);
            this.scale = value;
            if (Math.abs(this.scale - 1) < 0.01) {
                this.scale = 1;
            }

            var new_center = this.convertCanvasToOffset(zooming_center);
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