import { OrbitControls } from 'https://unpkg.com/three@0.151.3/examples/jsm/controls/OrbitControls.js';

export default class NodiInput {

	constructor( game ) {

		this.control = new OrbitControls(game.view.camera, game.view.renderer.domElement);
		this.control.mouseButtons.LEFT = game.view.three.MOUSE.PAN
		this.control.touches = {
		  ONE: game.view.three.TOUCH.PAN,
		  TWO: game.view.three.TOUCH.DOLLY_PAN
		}
		this.control.minDistance = 0.1;
		this.control.maxDistance = 100;
  
/*
		this.dragable = false;
		this.setView( game );

		this.draggingCanvas = false;
		this.pointerDown = false;
		this.pointerIsDouble = false;

		this.mouseStartCanvas = new Vec2( 0, 0 );
		this.mouseCurrentCanvas = new Vec2( 0, 0 );

		this._mousedown_callback = this.onMouseDown.bind( this );
		this._mousewheel_callback = this.onMouseWheel.bind( this );
		
		this._mousemove_callback = this.onMouseMove.bind( this );
		this._mouseup_callback = this.onMouseUp.bind( this );
		
		this._keydown_callback = this.onKeyDown.bind( this );
		this._keyup_callback = this.onKeyUp.bind( this );
*/
	}

	update() {
		this.control.update();
    }

/*
	setView( game ) {
		if (game === this.game ) return;

		if ( game == null) {
			this.removeEvents()
			return
		}
		
		this.game = game;
		this.canvas = game.canvas;
		this.addEvents();
	}

	addEvents() {
		if (this.canvas == null) return
		this.removeEvents()
		
		this.canvas.addEventListener( 'wheel', this._mousewheel_callback, false )
		this.canvas.addEventListener( 'pointerdown', this._mousedown_callback, false )
		this.canvas.addEventListener( 'pointerup', this._mouseup_callback, false )
		this.canvas.addEventListener( 'mousemove', this._mousemove_callback, false )
		this.canvas.addEventListener( 'pointermove', this._mousemove_callback, false )
		this.canvas.addEventListener( 'touchmove', this._mousemove_callback, false )
		this.canvas.addEventListener( 'DOMMouseScroll', this._mousewheel_callback, false )
		document.addEventListener( 'keydown', this._keydown_callback, false)
		document.addEventListener( 'keyup', this._keyup_callback, false)

		this._events_binded = true;
	}

	removeEvents() {
		if (this.canvas == null) return
    	this.canvas.removeEventListener( 'wheel', this._mousewheel_callback )
		this.canvas.removeEventListener( 'pointerdown', this._mousedown_callback )
		this.canvas.removeEventListener( 'pointerup', this._mouseup_callback )
		this.canvas.removeEventListener( 'mousemove', this._mousemove_callback )
		this.canvas.removeEventListener( 'pointermove', this._mousemove_callback )
		this.canvas.removeEventListener( 'touchmove', this._mousemove_callback )
		this.canvas.removeEventListener( 'DOMMouseScroll', this._mousewheel_callback )
		document.removeEventListener( 'keydown', this._keydown_callback)
		document.removeEventListener( 'keyup', this._keyup_callback)

		this._events_binded = false;
	}

	onKeyDown( e ) {
		for ( const layerName in this.game.layers ) {
			let layer = this.game.layers[layerName];
			if (layer?.onKeyDown) layer.onKeyDown(e)
		}
	}

	onKeyUp( e ) {
		for ( const layerName in this.game.layers ) {
			let layer = this.game.layers[layerName];
			if (layer?.onKeyUp) layer.onKeyUp(e)
		}
	}

	onMouseDown( e ) {

		let hit = false;
		let layers = Object.keys(this.game.layers).reverse();
		for ( const layerName of layers ) {
			const layer = this.game.layers[ layerName ];
			layer.extendMouseData( e );
			if (layer?.onMouseDown) {
				hit = hit || layer.onMouseDown( e, hit );
			}

		}

	}

	onMouseMove( e ) {

		let hit = false;
		let layers = Object.keys(this.game.layers).reverse();
		for ( const layerName of layers ) {
			const layer = this.game.layers[ layerName ];
			layer.extendMouseData( e );
			this.mouseCurrentCanvas.x = e.canvasX;
			this.mouseCurrentCanvas.y = e.canvasY;
			if (layer?.onMouseMove) {
				hit = hit || layer.onMouseMove( e, hit );
			}

		}

		e.preventDefault();
		return false;

	}

	onMouseUp( e ) {

		e.stopPropagation();
		e.preventDefault();
		let hit = false;

		let layers = Object.keys(this.game.layers).reverse();
		for ( const layerName of layers ) {
			const layer = this.game.layers[layerName];
			layer.extendMouseData( e );
			layer.mouseCurrentCanvas = new Vec2(e.canvasX, e.canvasY);
			var delta = layer.mouseCurrentCanvas.subtract( this.mouseStartCanvas );
			if (layer?.onMouseUp) {
				hit = hit || layer.onMouseUp( e, hit );
			  }
			if ( delta.length() < 0.1 && layer.onMouseClick) layer.onMouseClick( e );

		}


		return false;

	}

	onMouseWheel( e ) {

		var delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * - 60;

		//this.extendMouseData( e );



		e.preventDefault();

		return false;

	}*/

}
