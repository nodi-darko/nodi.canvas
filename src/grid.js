import { Vec2 } from './core/vec2.js';
import { NodiLayer } from './gui/layer.js';

class NodiGrid extends NodiLayer {

	constructor( name, gridSize, tileSize, lineWidth) {

		super( name );
		if (gridSize) this.gridSize = gridSize.clone();
		this.tileSize = tileSize;
		this.lineWidth = lineWidth;
		this.setGridScale( this.gridSize );
		if (this.gridSize) {
		  this.mid = this.gridSize.clone().divide( 2 );
		  this.size = this.gridSize.clone().multiply( this.tileSize );
		  this.ratio = this.size.x / this.size.y;
		}

	}

	extendMouseData( e ) {
		// TBD, include layer transformation
		e.canvasX = ( e.clientX - this.view.tx ) / this.view.scale;
		e.canvasY = ( e.clientY - this.view.ty ) / this.view.scale;
		e.gridX = Math.floor( e.canvasX / this.tileSize );
		e.gridY = Math.floor( e.canvasY / this.tileSize );

	}

	setGridScale (s) {
		this.gridScale = s;
	}

	worldToTileXY( x, y ) {

		return new Vec2( Math.floor( x / this.tileSize ), Math.floor( y / this.tileSize ) );

	}

	worldToTile( p ) {
		return this.worldToTileXY(p.x, p.y);
	}

	tileToWorld( p ) {
		return new Vec2( Math.floor( p.x * this.tileSize ), Math.floor( p.y * this.tileSize ) );
	}

	screenToTile( p ) {
		if (this.view) {
			let wp = this.view.screenToWorld(p)
			return this.worldToTile( wp );
		}
	}

	renderGrid( view ) {

		view.ctx.strokeStyle = '#555';

		let left = 0, top = 0, right, down;

		if ( this.w == 0 || this.w == undefined ) {

			right = left + this.gridSize.x;

		} else {

			right = this.w;

		}

		if ( this.h == 0 || this.h == undefined ) {

			down = top + this.gridSize.y;

		} else {

			down = this.h;

		}

		view.ctx.shadowColor = 'black';
		view.ctx.shadowBlur = 20;
		view.ctx.fillStyle = 'rgb(234, 234, 234)';
		view.ctx.fillRect( left, top, right, down );
		view.ctx.shadowColor = 'rgba(0,0,0,0)';
		//console.log("draw grid", grid_area[0]);
		view.ctx.lineWidth = this.lineWidth;
		view.ctx.beginPath();

		for ( var x = left; x <= right; x += 1 ) {

			view.ctx.moveTo( x, top );
			view.ctx.lineTo( x, down );

		}

		for ( var y = top; y <= down; y += 1 ) {

			view.ctx.moveTo( left, y );
			view.ctx.lineTo( right, y );

		}

		view.ctx.stroke();

	}

	/*
	renderGrid( view ) {

		view.ctx.strokeStyle = '#555';
		const marginx = this.viewPort.width * 0.1;
		const marginy = this.viewPort.height * 0.1;
		let left = 0, top = 0, right, down;

		if ( this.w == 0 || this.w == undefined ) {

			left = Math.floor( this.viewPort.x - marginx );
			right = left + this.viewPort.width + 2 * marginx;

		} else {

			right = this.w;

		}

		if ( this.h == 0 || this.h == undefined ) {

			top = Math.floor( this.viewPort.y - marginy );
			down = top + this.viewPort.height + 2 * marginy;

		} else {

			down = this.h;

		}

		view.ctx.shadowColor = 'black';
		view.ctx.shadowBlur = 20;
		view.ctx.fillStyle = 'rgb(234, 234, 234)';
		view.ctx.fillRect( left, top, right, down );
		view.ctx.shadowColor = 'rgba(0,0,0,0)';
		//console.log("draw grid", grid_area[0]);
		view.ctx.lineWidth = this.lineWidth;
		view.ctx.beginPath();

		for ( var x = left; x <= right; x += 1 ) {

			view.ctx.moveTo( x, top );
			view.ctx.lineTo( x, down );

		}

		for ( var y = top; y <= down; y += 1 ) {

			view.ctx.moveTo( left, y );
			view.ctx.lineTo( right, y );

		}

		view.ctx.stroke();

	}*/

}

export { NodiGrid };