/// <reference path="../types/global.d.ts" />

/**
 * Draws a polygon with the given points,
 * just like triangle and quad
 * 
 * @param  {...number} coords 
 */
export function polygon(...coords) {

    beginShape();
    /** @type {number[][]} */
    const initial = [];
	coords.reduce((acc, val, idx) => (idx % 2 ? acc[0].push(val) : acc.unshift([val]), acc), initial)
		.forReverse(p => vertex(p[0], p[1]));
	endShape(CLOSE);
}

/**
 * Draws a curve across the given points
 * 
 * @param  {...number} coords 
 */
export function spline(...coords) {
	beginShape();
	if (coords.length > 1)
		curveVertex(coords[0], coords[1]);
    /** @type {number[][]} */
    const initial = [];
	coords.reduce((acc, val, idx) => (idx % 2 ? acc[0].push(val) : acc.unshift([val]), acc), initial)
		.forReverse(p => curveVertex(p[0], p[1]));
	endShape(CLOSE);
}