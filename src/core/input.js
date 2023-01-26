import { Vec2 } from './vec2.js';

class NodiInput {

	constructor( view ) {

		this.dragable = false;
		this.setView( view );

		this.draggingCanvas = false;
		this.pointerDown = false;
		this.pointerIsDouble = false;

		this.mouseStartCanvas = new Vec2( 0, 0 );
		this.mouseCurrentCanvas = new Vec2( 0, 0 );

	}

	setView( view ) {

		if ( ! view || view === this.view ) {

			return;

		}

		this.view = view;
		this.canvas = view.canvas;

		this._mousedown_callback = this.onMouseDown.bind( this );
		this._mousewheel_callback = this.onMouseWheel.bind( this );
		
		this._mousemove_callback = this.onMouseMove.bind( this );
		this._mouseup_callback = this.onMouseUp.bind( this );
		
		this._keydown_callback = this.onKeyDown.bind( this );
		this._keyup_callback = this.onKeyUp.bind( this );

		canvas.addEventListener( 'wheel', this._mousewheel_callback, false )
		canvas.addEventListener( 'mousedown', this._mousedown_callback, false )
		canvas.addEventListener( 'pointerdown', this._mousedown_callback, false )
		canvas.addEventListener( 'mouseup', this._mouseup_callback, false )
		canvas.addEventListener( 'pointerup', this._mouseup_callback, false )
		canvas.addEventListener( 'mousemove', this._mousemove_callback, false )
		canvas.addEventListener( 'pointermove', this._mousemove_callback, false )
		canvas.addEventListener( 'touchmove', this._mousemove_callback, false )
		canvas.addEventListener( 'DOMMouseScroll', this._mousewheel_callback, false )
		document.addEventListener( 'keydown', this._keydown_callback, false)
		document.addEventListener( 'keyup', this._keyup_callback, false)

		this._events_binded = true;

	}

	onKeyDown( e ) {
		for ( const layerName in this.view.layers ) {
			let layer = this.view.layers[layerName];
			if (layer?.onKeyDown) layer.onKeyDown(e)
		}
	}

	onKeyUp( e ) {
		for ( const layerName in this.view.layers ) {
			let layer = this.view.layers[layerName];
			if (layer?.onKeyUp) layer.onKeyUp(e)
		}
	}

	onMouseDown( e ) {

		let hit = false;
		let layers = Object.keys(this.view.layers).reverse();
		for ( const layerName of layers ) {
			const layer = this.view.layers[ layerName ];
			layer.extendMouseData( e );
			if (layer?.onMouseDown) {
				hit = hit || layer.onMouseDown( e, hit );
			}

		}

		if ( hit == false ) {

			var is_primary = e.isPrimary === undefined || ! e.isPrimary;
			this.mouseStartCanvas = new Vec2( e.canvasX, e.canvasY );
			this.mouseCurrentCanvas = this.mouseStartCanvas.clone();

			if ( this.pointerDown && is_primary ) {

				this.pointerIsDouble = true;

			} else {

				this.pointerIsDouble = false;

			}

			this.pointerDown = true;
			this.canvas.focus();

			//left button mouse / single finger
			if ( e.which == 1 && ! this.pointerIsDouble && this.dragable ) {

				this.draggingCanvas = true;

			}

			this.isMouseDown = true;

		}

	}

	onMouseMove( e ) {

		let hit = false;
		let layers = Object.keys(this.view.layers).reverse();
		for ( const layerName of layers ) {
			const layer = this.view.layers[ layerName ];
			layer.extendMouseData( e );
			this.mouseCurrentCanvas.x = e.canvasX;
			this.mouseCurrentCanvas.y = e.canvasY;
			if (layer?.onMouseMove) {
				hit = hit || layer.onMouseMove( e, hit );
			}

		}

		var delta = this.mouseCurrentCanvas.subtract( this.mouseStartCanvas );

		e.dragging = this.isMouseDown;

		if ( this.draggingCanvas ) {

			//console.log("pointerevents: processMouseMove is dragging_canvas", delta.x, delta.y, this.scale);
			this.dx = delta.x * this.scale;
			this.dy = delta.y * this.scale;
			this.updateViewRect();

		}

		e.preventDefault();
		return false;

	}

	onMouseUp( e ) {

		e.stopPropagation();
		e.preventDefault();
		let hit = false;

		let layers = Object.keys(this.view.layers).reverse();
		for ( const layerName of layers ) {
			const layer = this.view.layers[layerName];
			layer.extendMouseData( e );
			layer.mouseCurrentCanvas = new Vec2(e.canvasX, e.canvasY);
			var delta = layer.mouseCurrentCanvas.subtract( this.mouseStartCanvas );
			if (layer?.onMouseUp) {
				hit = hit || layer.onMouseUp( e, hit );
			  }
			if ( delta.length() < 0.1 && layer.onMouseClick) layer.onMouseClick( e );

		}

		if ( hit == false && this.draggingCanvas ) {

			var isPrimary = e.isPrimary === undefined || e.isPrimary;
			this.node_mouse_down = null;

			if ( ! isPrimary ) {

				return false;

			}


			this.tx += delta.x * this.scale;
			this.ty += delta.y * this.scale;
			this.dx = 0;
			this.dy = 0;
			this.isMouseDown = false;
			this.last_click_position = null;

			this.draggingCanvas = false;

			if ( isPrimary ) {

				this.pointerDown = false;
				this.pointerIsDouble = false;

			}

			this.last_mouse = this.mouseCurrentCanvas;

		}

		return false;

	}

	onMouseWheel( e ) {

		var delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * - 60;

		//this.extendMouseData( e );

		var scale = this.view.scale;

		if ( delta > 0 ) {

			scale *= 1.1;

		} else if ( delta < 0 ) {

			scale *= 1 / 1.1;

		}

		this.view.setScale( scale );


		e.preventDefault();
		this.view.focusOn();
		return false;

	}

}

export { NodiInput };