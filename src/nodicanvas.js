


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