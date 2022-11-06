import NodiScene from '../src/gui/view.js';

const canvas = document.getElementById( 'nodicanvas' );

// create view
const game = new NodiScene( canvas );
game.setScale( 30 );


// add custom layer
const coverLayer = game.newLayer( 'cover' );

coverLayer.color = 'gray';

coverLayer.render = function ( game ) {

	const ctx = game.ctx;
	ctx.lineWidth = 1;
	ctx.fillStyle = coverLayer.color;
	ctx.fillRect( - 1, - 1, 2, 2 );

};

coverLayer.onMouseDown = function ( ) {

	coverLayer.color = 'red';

};

// redraw after resize event
window.view = game;
window.addEventListener( 'resize', function () {

	window.view.resize();

} );
