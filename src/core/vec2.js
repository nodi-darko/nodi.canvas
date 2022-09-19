// 2D Vector

export default class Vec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    invert() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    add(v) {
        if (v instanceof Vec2) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    }

    subtract(v) {
        if (v instanceof Vec2) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    }

    multiply(v) {
        if (v instanceof Vec2) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    divide(v) {
        if (v instanceof Vec2) {
            if (v.x != 0)
                this.x /= v.x;
            if (v.y != 0)
                this.y /= v.y;
        } else {
            if (v != 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.divide(this.length());
    }

    min() {
        return Math.min(this.x, this.y);
    }

    max() {
        return Math.max(this.x, this.y);
    }

    toAngles() {
        return -Math.atan2(-this.y, this.x);
    }

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n) {
        return [this.x, this.y].slice(0, n || 2);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    set(x, y) {
        this.x = x; this.y = y;
        return this;
    }


}



Vec2.invert = function(v) {
    return new Vec2(-v.x, -v.y);
};
Vec2.add = function(a, b) {
    if (b instanceof Vec2) return new Vec2(a.x + b.x, a.y + b.y);
    else return new Vec2(a.x + b, a.y + b);
};
Vec2.subtract = function(a, b) {
    if (b instanceof Vec2) return new Vec2(a.x - b.x, a.y - b.y);
    else return new Vec2(a.x - b, a.y - b);
};
Vec2.multiply = function(a, b) {
    if (b instanceof Vec2) return new Vec2(a.x * b.x, a.y * b.y);
    else return new Vec2(a.x * b, a.y * b);
};
Vec2.divide = function(a, b) {
    if (b instanceof Vec2) return new Vec2(a.x / b.x, a.y / b.y);
    else return new Vec2(a.x / b, a.y / b);
};
Vec2.equals = function(a, b) {
    return a.x == b.x && a.y == b.y;
};
Vec2.dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
};
Vec2.cross = function(a, b) {
    return a.x * b.y - a.y * b.x;
};

Vec2.distance = function(a, b) {
    let va, vb;
    if (a instanceof Vec2 == false) va = new Vec2(a[0], a[1]);
    if (b instanceof Vec2 == false) vb = new Vec2(b[0], b[1]);
    let d = va.subtract(vb);
    return Math.sqrt((d[0] * d[0]) + (d[1] * d[1]));
}

Vec2.getRandom = function(mx, my) {
    return new Vec2(Math.getRandomInt(mx), Math.getRandomInt(my))
}