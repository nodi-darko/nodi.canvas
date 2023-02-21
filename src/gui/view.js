import { Vec2 } from '../core/vec2.js';
import { NodiInput } from '../nodicanvas.js';
import { NodiGrid } from './grid.js';

class NodiView extends NodiGrid {

	constructor( canvas, gridSize, tileSize ) {

		super( "view", gridSize, tileSize );
		this.layers = {};
		this.layerOrder = []
		this.dragable = false;

		this.setCanvas( canvas );

		this.draggingCanvas = false;
		this.pointerDown = false;
		this.pointerIsDouble = false;
		this.viewPort = new DOMRect();

		this.center = new Vec2( 0, 0 );
	}

	setCanvas( canvas ) {
		if ( canvas === this.canvas ) return

		if (canvas) {
			this.startRendering();
			this.canvas = canvas;
			this.input = new NodiInput(this);
		} else {
			this.stopRendering()
			this.input = null
			this.canvas = null
		}

		this.ctx = this.canvas?.getContext( '2d' );

	}

	getCanvasWindow() {

		if ( ! this.canvas ) {

			return window;

		}

		var doc = this.canvas.ownerDocument;
		return doc.defaultView || doc.parentWindow;

	}

	startRendering() {

		if ( this.isRendering ) return; //already rendering

		this.isRendering = true;
		renderFrame.call( this );

		function renderFrame() {

			this.render();

			var window = this.getCanvasWindow();
			if ( this.isRendering ) {

				window.requestAnimationFrame( renderFrame.bind( this ) );

			}

		}

	}

	stopRendering() {

		this.isRendering = false;

	}


	addLayer( newLayer ) {

		if ( newLayer ) {

			newLayer.attachView( this );
			this.layers[ newLayer.name ] = newLayer;
			this.layerOrder.push(newLayer.name);

		}

		// refresh completely
		this.resize();

	}

	newLayer( name, gridSize, tileSize, lineWidth ) {

		const layer = new NodiGrid( name, gridSize, tileSize, lineWidth );
		layer.view = this;
		this.addLayer( layer );
		return layer;

	}

	render() {

		if ( this.canvas?.width == 0 || this.canvas?.height == 0 || this.ctx == null) {

			return;

		}

		this.ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		this.ctx.fillStyle = 'lightgray';
		this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

		// transform camera
		this.ctx.setTransform(
			this.sx,
			0,
			0,
			this.sy,
			this.tx + this.dx,
			this.ty + this.dy
		);

		for ( const layerName of this.layerOrder ) {

			const layer = this.layers[ layerName ];
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
			this.ctx.transform( layer.sx, 0, 0, layer.sy, layer.tx, layer.ty );

			// draw layer
			if ( layer.gridVisible ) layer.renderGrid( this );
			if ( layer.visible ) layer.render( this );

		}

		if ( this.hud ) this.hud.render();

	}

	resize( width, height ) {

		if (this.canvas == null) return

		if ( this.canvas.width == width && this.canvas.height == height ) {
			return;
		}

		if ( !width && !height ) {
			var parent = this.canvas.parentNode;
			width = parent.offsetWidth;
			height = parent.offsetHeight;
		}

		this.canvas.width = width;
		this.canvas.height = height;

		this.focusOn();

		this.updateViewPort();
		this.updateViewRect();

		this.focusOn();
	}

	screenToWorld (p) {
		return { x: (p.x - this.tx ) / this.sx , y: (p.y - this.ty) / this.sy  }
	  }
	  
	setScale( s ) {

		this.sx = s;
		this.sy = s;
		super.setScale( s );

	}

	setTranslate( x, y ) {

		this.tx = x;
		this.ty = y;

	}

	focusOn() {

		if (this.canvas == null) return
		
		var halfScreenSize = Vec2.divide(new Vec2(this.canvas.width, this.canvas.height), 2);

		const delta = Vec2.subtract(Vec2.multiply(this.center, this.sx), halfScreenSize) //Vec2.subtract( halfScreenSize, this.center );

		this.tx = -delta.x;
		this.ty = -delta.y;

	}

	setCenter( x, y ) {

		this.center.x = x;
		this.center.y = y;

	}

	updateViewRect() {

		for ( const layerName in this.layers ) {

			const layer = this.layers[ layerName ];
			layer.updateViewPort();

		}

	}

}

export { NodiView };