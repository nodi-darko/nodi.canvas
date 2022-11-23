import { Transformation } from '../core/transformation.js';

class NodiLayer extends Transformation {

	constructor( name ) {

		super();
		this.name = name;
		this.viewPort = new DOMRect( 4 );
		this.pointerevents_method = 'mouse';
		this.visible = true;

	}

	attachView( view ) {

		this.view = view;
		this.updateViewPort();

	}

	updateViewPort() {

		if ( ! this.view ) return;
		var left = this.tx - ( this.view.tx + this.view.dx );
		var top = this.ty - ( this.view.ty + this.view.dy );

		this.viewPort.x = left;
		this.viewPort.y = top;
		this.viewPort.width = this.view.canvas.width * this.scale / this.view.scale;
		this.viewPort.height = this.view.canvas.height * this.scale / this.view.scale;

	}

	fillText( t, pos ) {

		this.view.ctx.fillText( t, ( pos.x + 0.5 ), ( pos.y + 0.75 ) );

	}

	onMouseClick( ) {

		return false;

	}
	onMouseDown() {

		return false;

	}
	onMouseUp( ) {

		return false;

	}
	render() {}

}

export { NodiLayer };