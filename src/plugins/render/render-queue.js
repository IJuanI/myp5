import { myP5 } from "../../base.js";

myP5.on('init', () => {
	myP5.registerPlugin('render-queue');

    myP5.shared.renderQueue = [];
    myP5.shared.frameCount = 0;

	const enqueue = (fnName) => {
		const fnRef = globalThis[fnName];
		return function() {
			const drawCall = { name: fnName, fn: fnRef, args: [...arguments] };
            myP5.emit('rq.enqueue:before', drawCall, false);
            if (myP5.emit('rq.enqueue', drawCall)) {
                myP5.shared.renderQueue.push(drawCall);
                myP5.shared.lastDrawCall = drawCall;
                myP5.emit('rq.enqueue:after', drawCall, false);
            }
		};
	};

	['background', 'clear', 'colorMode', 'fill', 'noFill', 'noStroke', 'stroke',
		'arc', 'ellipse', 'line', 'point', 'quad', 'rect', 'triangle',
		'ellipseMode', 'noSmooth', 'rectMode', 'smooth', 'strokeCap', 'strokeJoin', 'strokeWeight',
		'bezier', 'bezierDetail', 'bezierPoint', 'bezierTangent', 'curveDetail', 'curveTightness', 'curvePoint', 'curveTangent',
		'beginContour', 'beginShape', 'bezierVertex', 'curveVertex', 'endContour', 'endShape', 'quadraticVertex', 'vertex',
		'applyMatrix', 'resetMatrix', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'shearX', 'shearY', 'translate',
		'textAlign', 'textLeading', 'textSize', 'textStyle', 'textWidth', 'textAscent', 'textDescent', 'textWrap', 'text', 'textFont',
        'push', 'pop'
	].forEach(fnName => globalThis[fnName] = enqueue(fnName));

    const oldDraw = globalThis.draw;
    globalThis.draw = function() {
        oldDraw.bind(this)();
        const iterableQueue = myP5.shared.renderQueue instanceof Array
            ? myP5.shared.renderQueue
            : Object.keys(myP5.shared.renderQueue);
        myP5.emit('rq.render:before', iterableQueue, false);
        iterableQueue.forEach(drawCall => {
            if (myP5.emit('rq.render', drawCall)) {
                myP5.emit('rq.drawCall:before', drawCall, false);
                if (myP5.emit('rq.drawCall', drawCall)) {
                    drawCall.fn(...drawCall.args);
                    myP5.emit('rq.drawCall:after', drawCall, false);
                }
            }
        });
        myP5.emit('rq.render:after', undefined, false);
        ++myP5.shared.frameCount;
    }
});
