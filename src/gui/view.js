import Vec2 from "../core/vec2.js";
import NodiLayer from "../gui/layer.js";

export default class NodiView extends NodiLayer {
  constructor(canvas) {
    super([10, 0.1]);
    this.layers = [];

    this.dragable = true;

    this.mouseStartCanvas = new Vec2(0, 0);
    this.mouseCurrentCanvas = new Vec2(0, 0);

    this.setCanvas(canvas);

    this.draggingCanvas = false;
    this.pointerDown = false;
    this.pointerIsDouble = false;
    this.viewPort = new DOMRect();

    this.startRendering();
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
      //console.log("pointerevents: dragging_canvas start");
      this.draggingCanvas = true;
    }

    this.isMouseDown = true;

    return false;
  }

  onMouseMove(e) {
    if (this.layers.length == 0) {
      return;
    }
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
    if (this.layers.length == 0) return;

    var isPrimary = e.isPrimary === undefined || e.isPrimary;
    this.node_mouse_down = null;

    if (!isPrimary) {
      return false;
    }

    this.extendMouseData(e);
    this.mouseCurrentCanvas.x = e.canvasX;
    this.mouseCurrentCanvas.y = e.canvasY;

    var delta = this.mouseCurrentCanvas.subtract(this.mouseStartCanvas);

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
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  onMouseWheel(e) {
    if (this.layers.length == 0 || !this.dragable) {
      return;
    }

    var delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;

    this.extendMouseData(e);

    var scale = this.scale;

    if (delta > 0) {
      scale *= 1.1;
    } else if (delta < 0) {
      scale *= 1 / 1.1;
    }

    this.setScale(scale, [e.clientX, e.clientY]);

    e.preventDefault();
    return false;
  }

  extendMouseData(e) {
    var clientX_rel = 0;
    var clientY_rel = 0;

    if (this.canvas) {
      var b = this.canvas.getBoundingClientRect();
      clientX_rel = e.clientX - b.left;
      clientY_rel = e.clientY - b.top;
    } else {
      clientX_rel = e.clientX;
      clientY_rel = e.clientY;
    }
    e.canvasX = clientX_rel / this.scale - this.tx;
    e.canvasY = clientY_rel / this.scale - this.ty;
  }

  addLayer(newLayer) {
    if (newLayer) {
      newLayer.attachView(this);
      this.layers.push(newLayer);
    }

    // refresh completely
    this.resize();
  }

  render() {
    if (this.canvas?.width == 0 || this.canvas?.height == 0) {
      return;
    }
    var ctx = this.ctx;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let layer of this.layers) {
      // transform camera
      ctx.setTransform(
        this.sx,
        0,
        0,
        this.sy,
        this.tx + this.dx,
        this.ty + this.dy
      );

      //transform layer
      ctx.transform(layer.sx, 0, 0, layer.sy, layer.tx, layer.ty);

      // draw layer
      layer.render(this);
    }
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
  }

  updateViewRect() {
    for (let layer of this.layers) {
      layer.updateViewPort();
    }
  }
}
