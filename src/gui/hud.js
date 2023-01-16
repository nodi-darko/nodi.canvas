import { NodiGrid } from '../gui/grid.js';

class NodiHud extends NodiGrid {

	constructor( name, view ) {

		super(name);
		this.view = view;

	}

	render() {

		const ctx = this.view.ctx;
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		ctx.font = '20px Arial';
		ctx.fillStyle = 'black';

		ctx.fillText( 'Score: ' + parseInt( this.view.point ), 60, 30 );

		if ( this.msgText ) {

			ctx.fillText( this.msgText, ( this.view.viewPort.width  ) / 2, 30 );

		}

	}

	showMsg( msg ) {

		this.msgText = msg[ 0 ];
		setTimeout( this.removeText, msg[ 1 ], this );

	}

	removeText( hud ) {

		hud.msgText = undefined;

	}

}

export { NodiHud };