/**
            * @license
            * SPDX-License-Identifier: MIT
            */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// 2D Vector

class Vec2 {
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
			if (v.x != 0) this.x /= v.x;
			if (v.y != 0) this.y /= v.y;
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
		this.x = x;
		this.y = y;
		return this;
	}
}
Vec2.invert = function (v) {
	return new Vec2(-v.x, -v.y);
};
Vec2.add = function (a, b) {
	if (b instanceof Vec2) return new Vec2(a.x + b.x, a.y + b.y);else return new Vec2(a.x + b, a.y + b);
};
Vec2.subtract = function (a, b) {
	if (b instanceof Vec2) return new Vec2(a.x - b.x, a.y - b.y);else return new Vec2(a.x - b, a.y - b);
};
Vec2.multiply = function (a, b) {
	if (b instanceof Vec2) return new Vec2(a.x * b.x, a.y * b.y);else return new Vec2(a.x * b, a.y * b);
};
Vec2.divide = function (a, b) {
	if (b instanceof Vec2) return new Vec2(a.x / b.x, a.y / b.y);else return new Vec2(a.x / b, a.y / b);
};
Vec2.equals = function (a, b) {
	return a.x == b.x && a.y == b.y;
};
Vec2.dot = function (a, b) {
	return a.x * b.x + a.y * b.y;
};
Vec2.cross = function (a, b) {
	return a.x * b.y - a.y * b.x;
};
Vec2.distance = function (a, b) {
	let va, vb;
	if (a instanceof Vec2 == false) va = new Vec2(a[0], a[1]);
	if (b instanceof Vec2 == false) vb = new Vec2(b[0], b[1]);
	const d = va.subtract(vb);
	return Math.sqrt(d[0] * d[0] + d[1] * d[1]);
};
Vec2.getRandom = function (mx, my) {
	return new Vec2(Math.getRandomInt(mx), Math.getRandomInt(my));
};

class Transformation {
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
		return new Vec2((pos.x + this.tx) * this.scale, (pos.y + this.ty) * this.scale);
	}
	toCanvas(pos) {
		return new Vec2(this.tx + pos.x / this.scale, this.ty + pos.y / this.scale);
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
		if (zooming_center) {
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

class NodiLayer extends Transformation {
	constructor(name) {
		super();
		this.name = name;
		this.viewPort = new DOMRect(4);
		this.pointerevents_method = 'mouse';
		this.visible = true;
	}
	attachView(view) {
		this.view = view;
		this.updateViewPort();
	}
	updateViewPort() {
		if (!this.view) return;
		var left = this.tx - (this.view.tx + this.view.dx);
		var top = this.ty - (this.view.ty + this.view.dy);
		this.viewPort.x = left;
		this.viewPort.y = top;
		this.viewPort.width = this.view.canvas.width * this.scale / this.view.scale;
		this.viewPort.height = this.view.canvas.height * this.scale / this.view.scale;
	}
	fillText(t, pos) {
		this.view.ctx.fillText(t, pos.x + 0.25, pos.y + 0.9);
	}
	onMouseClick() {
		return false;
	}
	onMouseDown() {
		return false;
	}
	onMouseUp() {
		return false;
	}
	render() {}
}

class NodiHud extends NodiLayer {
	constructor(game) {
		super();
		this.game = game;
	}
	render() {
		const ctx = this.game.ctx;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.font = '20px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText('score: ' + parseInt(this.game.point), 30, 30);
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

class NodiGrid extends NodiLayer {
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
		view.ctx.strokeStyle = '#555';
		const marginx = this.viewPort.width * 0.1;
		const marginy = this.viewPort.height * 0.1;
		let left = 0,
			top = 0,
			right,
			down;
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
		view.ctx.shadowColor = 'black';
		view.ctx.shadowBlur = 20;
		view.ctx.fillStyle = 'rgb(234, 234, 234)';
		view.ctx.fillRect(left, top, right, down);
		view.ctx.shadowColor = 'rgba(0,0,0,0)';
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

class NodiView extends NodiLayer {
	constructor(canvas) {
		super([10, 0.1]);
		super.view = this;
		this.layers = {};
		this.dragable = false;
		this.mouseStartCanvas = new Vec2(0, 0);
		this.mouseCurrentCanvas = new Vec2(0, 0);
		this.setCanvas(canvas);
		this.draggingCanvas = false;
		this.pointerDown = false;
		this.pointerIsDouble = false;
		this.viewPort = new DOMRect();
		this.startRendering();
		this.center = new Vec2(0, 0);
		this.zoomPoint = new Vec2(0, 0);
	}
	setCanvas(canvas) {
		if (!canvas || canvas === this.canvas) {
			return;
		}
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this._mousedown_callback = this.onMouseDown.bind(this);
		this._mousewheel_callback = this.onMouseWheel.bind(this);
		// why mousemove and mouseup were not binded here?
		this._mousemove_callback = this.onMouseMove.bind(this);
		this._mouseup_callback = this.onMouseUp.bind(this);
		canvas.addEventListener('mousewheel', this._mousewheel_callback, false);
		canvas.addEventListener('mousedown', this._mousedown_callback, false);
		canvas.addEventListener('mouseup', this._mouseup_callback, false);
		canvas.addEventListener('mousemove', this._mousemove_callback, false);
		canvas.addEventListener('DOMMouseScroll', this._mousewheel_callback, false);
		this._events_binded = true;
	}
	getCanvasWindow() {
		if (!this.canvas) {
			return window;
		}
		var doc = this.canvas.ownerDocument;
		return doc.defaultView || doc.parentWindow;
	}
	startRendering() {
		if (this.isRendering) {
			return;
		} //already rendering

		this.isRendering = true;
		renderFrame.call(this);
		function renderFrame() {
			this.render();
			var window = this.getCanvasWindow();
			if (this.isRendering) {
				window.requestAnimationFrame(renderFrame.bind(this));
			}
		}
	}
	stopRendering() {
		this.isRendering = false;
	}
	onMouseDown(e) {
		this.extendMouseData(e);
		let hit = false;
		for (const layerName in this.layers) {
			const layer = this.layers[layerName];
			hit = hit || layer.onMouseDown(e);
		}
		if (hit == false) {
			var is_primary = e.isPrimary === undefined || !e.isPrimary;
			this.mouseStartCanvas = new Vec2(e.canvasX, e.canvasY);
			this.mouseCurrentCanvas = this.mouseStartCanvas.clone();
			if (this.pointerDown && is_primary) {
				this.pointerIsDouble = true;
			} else {
				this.pointerIsDouble = false;
			}
			this.pointerDown = true;
			this.canvas.focus();

			//left button mouse / single finger
			if (e.which == 1 && !this.pointerIsDouble && this.dragable) {
				this.draggingCanvas = true;
			}
			this.isMouseDown = true;
		}
	}
	onMouseMove(e) {
		this.extendMouseData(e);
		this.mouseCurrentCanvas.x = e.canvasX;
		this.mouseCurrentCanvas.y = e.canvasY;
		var delta = this.mouseCurrentCanvas.subtract(this.mouseStartCanvas);
		e.dragging = this.isMouseDown;
		if (this.draggingCanvas) {
			//console.log("pointerevents: processMouseMove is dragging_canvas", delta.x, delta.y, this.scale);
			this.dx = delta.x * this.scale;
			this.dy = delta.y * this.scale;
			this.updateViewRect();
		}
		e.preventDefault();
		return false;
	}
	onMouseUp(e) {
		e.stopPropagation();
		e.preventDefault();
		this.extendMouseData(e);
		this.mouseCurrentCanvas.x = e.canvasX;
		this.mouseCurrentCanvas.y = e.canvasY;
		var delta = this.mouseCurrentCanvas.subtract(this.mouseStartCanvas);
		let hit = false;
		for (const layerName in this.layers) {
			const layer = this.layers[layerName];
			layer.onMouseUp(e);
			if (delta.length() < 0.1) layer.onMouseClick(e);
			hit = hit || layer.onMouseUp(e);
		}
		if (hit == false && this.draggingCanvas) {
			var isPrimary = e.isPrimary === undefined || e.isPrimary;
			this.node_mouse_down = null;
			if (!isPrimary) {
				return false;
			}
			this.tx += delta.x * this.scale;
			this.ty += delta.y * this.scale;
			this.dx = 0;
			this.dy = 0;
			this.isMouseDown = false;
			this.last_click_position = null;
			this.draggingCanvas = false;
			if (isPrimary) {
				this.pointerDown = false;
				this.pointerIsDouble = false;
			}
			this.last_mouse = this.mouseCurrentCanvas;
		}
		return false;
	}
	onMouseWheel(e) {
		var delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
		this.extendMouseData(e);
		var scale = this.scale;
		if (delta > 0) {
			scale *= 1.1;
		} else if (delta < 0) {
			scale *= 1 / 1.1;
		}
		this.setScale(scale);
		e.preventDefault();
		this.focusOn();
		return false;
	}
	extendMouseData(e) {
		e.canvasX = (e.clientX - this.tx) / this.scale;
		e.canvasY = (e.clientY - this.ty) / this.scale;
		e.gridX = Math.floor(e.canvasX);
		e.gridY = Math.floor(e.canvasY);
	}
	addLayer(newLayer) {
		if (newLayer) {
			newLayer.attachView(this);
			this.layers[newLayer.name] = newLayer;
		}

		// refresh completely
		this.resize();
	}
	render() {
		if (this.canvas?.width == 0 || this.canvas?.height == 0) {
			return;
		}
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = 'lightgray';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// transform camera
		this.ctx.setTransform(this.sx, 0, 0, this.sy, this.tx + this.dx, this.ty + this.dy);
		if (this.grid) this.grid.render(this);
		for (const layerName in this.layers) {
			const layer = this.layers[layerName];
			// transform camera
			this.ctx.setTransform(this.sx, 0, 0, this.sy, this.tx + this.dx, this.ty + this.dy);

			//transform layer
			this.ctx.transform(layer.sx, 0, 0, layer.sy, layer.tx, layer.ty);

			// draw layer
			if (layer.visible) layer.render(this);
		}
		if (this.hud) this.hud.render();
	}
	resize(width, height) {
		if (!width && !height) {
			var parent = this.canvas.parentNode;
			width = parent.offsetWidth;
			height = parent.offsetHeight;
		}
		if (this.canvas.width == width && this.canvas.height == height) {
			return;
		}
		this.canvas.width = width;
		this.canvas.height = height;
		this.updateViewPort();
		this.updateViewRect();
		this.focusOn();
	}
	setScale(s) {
		super.setScale(s);
	}
	setTranslate(x, y) {
		this.tx = x;
		this.ty = y;
	}
	focusOn() {
		const delta = Vec2.multiply(this.center, this.scale);
		this.tx = this.viewPort.x + this.viewPort.width / 2 - delta.x;
		this.ty = this.viewPort.y + this.viewPort.height / 2 - delta.y;
	}
	setCenter(x, y) {
		this.center.x = x;
		this.center.y = y;
		this.zoomPoint.x = x;
		this.zoomPoint.y = y;
	}
	updateViewRect() {
		for (const layerName in this.layers) {
			const layer = this.layers[layerName];
			layer.updateViewPort();
		}
	}
}

class NodiScene extends NodiView {
	constructor(canvas) {
		super(canvas);
		this.level = 1;
		this.state = 'init';
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
		const layer = new NodiLayer(name);
		layer.game = this;
		this.addLayer(layer);
		return layer;
	}
	reset() {
		this.point = 0;
		this.level = 1;
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
if (typeof window !== 'undefined') {
	if (window.__NODICANVAS__) {
		console.warn('WARNING: Multiple instances of nodicanvas.js being imported.');
	} else {
		window.__NODICANVAS__ = 1;
	}
}

exports.NodiGrid = NodiGrid;
exports.NodiHud = NodiHud;
exports.NodiLayer = NodiLayer;
exports.NodiScene = NodiScene;
exports.NodiView = NodiView;
exports.Transformation = Transformation;
exports.Vec2 = Vec2;
exports.getRandomInt = getRandomInt;
