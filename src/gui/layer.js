import { Transformation } from '../core/transformation.js';

export class NodiLayer extends Transformation {

	constructor( name, zIndex ) {

		super();
		this.name = name;
		this.viewPort = new DOMRect( 4 );
		this.pointerevents_method = 'mouse';
		this.visible = true;
		this.zIndex = zIndex;

	}

	attachView( view ) {

		this.view = view;
		this.updateViewPort();

	}

	updateViewPort() {
		if (this.canvas == null) return
		if ( this.view ) {
			var left = this.tx - ( this.view.tx + this.view.dx );
			var top = this.ty - ( this.view.ty + this.view.dy );

			this.viewPort.x = left;
			this.viewPort.y = top;
			this.viewPort.width = this.view.canvas.width * this.scale / this.view.scale;
			this.viewPort.height = this.view.canvas.height * this.scale / this.view.scale;
		} else {
			this.viewPort.x = 0;
			this.viewPort.y = 0;
			this.viewPort.width = this.canvas.width
			this.viewPort.height = this.canvas.height

		}

	}

	fillText( t, pos ) {

		this.view.ctx.fillText( t, ( pos.x + 0.5 ), ( pos.y + 0.75 ) );

	}

}
