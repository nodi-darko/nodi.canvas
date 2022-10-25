export { Vec2 } from './core/vec2.js';
export { Transformation } from './core/transformation.js';
export { NodiLayer } from './gui/layer.js';
export { NodiHud } from './gui/hud.js';
export { NodiGrid } from './gui/grid.js';
export { NodiScene } from './gui/scene.js';
export { NodiView } from './gui/view.js';

export function getRandomInt( max ) {

	return Math.floor( Math.random() * max );

}

if ( typeof window !== 'undefined' ) {

	if ( window.__NODICANVAS__ ) {

		console.warn( 'WARNING: Multiple instances of nodicanvas.js being imported.' );

	} else {

		window.__NODICANVAS__ = 1;

	}

}
