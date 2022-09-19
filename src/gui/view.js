import Vec2 from "../core/vec2.js";
import NodiLayer from "../gui/layer.js";
import NodiHud from "./hud.js";

export default class NodiView extends NodiLayer {
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
    this.ctx = this.canvas.getContext("2d");

    this._mousedown_callback = this.onMouseDown.bind(this);
    this._mousewheel_callback = this.onMouseWheel.bind(this);
    // why mousemove and mouseup were not binded here?
    this._mousemove_callback = this.onMouseMove.bind(this);
    this._mouseup_callback = this.onMouseUp.bind(this);

    canvas.addEventListener("mousewheel", this._mousewheel_callback, false);
    canvas.addEventListener("mousedown", this._mousedown_callback, false);
    canvas.addEventListener("mouseup", this._mouseup_callback, false);
    canvas.addEventListener("mousemove", this._mousemove_callback, false);
    canvas.addEventListener("DOMMouseScroll", this._mousewheel_callback, false);

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
    for (let layerName in this.layers) {
      let layer = this.layers[layerName];

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

    for (let layerName in this.layers) {
      let layer = this.layers[layerName];
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

    // transform camera
    this.ctx.setTransform(
      this.sx,
      0,
      0,
      this.sy,
      this.tx + this.dx,
      this.ty + this.dy
    );
    if (this.grid) this.grid.render(this);

    for (let layerName in this.layers) {
      let layer = this.layers[layerName];
      // transform camera
      this.ctx.setTransform(
        this.sx,
        0,
        0,
        this.sy,
        this.tx + this.dx,
        this.ty + this.dy
      );

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
    let delta = Vec2.multiply(this.center, this.scale);
    
    this.tx = (this.viewPort.x + this.viewPort.width / 2) - delta.x;
    this.ty = (this.viewPort.y + this.viewPort.height / 2) - delta.y;
  }

  setCenter(x, y) {
    this.center.x = x;
    this.center.y = y;
    this.zoomPoint.x = x;
    this.zoomPoint.y = y;
  }

  updateViewRect() {
    for (let layerName in this.layers) {
      let layer = this.layers[layerName];
      layer.updateViewPort();
    }
  }
}
