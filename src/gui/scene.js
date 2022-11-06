import { NodiHud } from './hud.js';
import { NodiLayer } from './layer.js';
import { NodiView } from './view.js';

class NodiScene extends NodiView {

	constructor( canvas ) {

		super( canvas );

		this.level = 1;
		this.state = 'init';
		this.lastCell = 1;
		this.point = 0;

		super.hud = new NodiHud( this );

	}

	setGrid( grid ) {

		this.grid = grid;

	}

	addHUD( hud ) {

		this.hud = hud;

	}

	newLayer( name ) {

		const layer = new NodiLayer( name );
		layer.game = this;
		this.addLayer( layer );
		return layer;

	}

	reset() {

		this.point = 0;
		this.level = 1;

	}

}

export { NodiScene };
