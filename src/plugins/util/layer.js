import { myP5 } from '../../base.js';
import '../render/render-queue.js';

myP5.on('init', () => {
	myP5.registerPlugin('layer');

	myP5.shared.layerStack = [0];
    myP5.shared.renderQueue = {};
});

/**
 * 
 * @param {number} layer 
 * @returns {number} The current layer
 */
myP5.public.layer = function(layer) {
	if (layer !== undefined) {
		if (myP5.shared.lastDrawCall?.name === 'push') {
			// Special case, need to move the push command to the new layer
			const currLayer = myP5.shared.layerStack[0];
			const pushCall = myP5.shared.renderQueue[currLayer].pop();
			(myP5.shared.renderQueue[layer] || (myP5.shared.renderQueue[layer] = [])).push(pushCall);
		}

		myP5.shared.layerStack[0] = layer;
		myP5.shared.lastDrawCall = null;
	}
	return myP5.shared.layerStack[0];
};

myP5.on('rq.enqueue', (ev) => {

	if (ev.value.name === 'push') {
		myP5.shared.layerStack.unshift(myP5.shared.layerStack[0]);
	}

	const layer = myP5.shared.layerStack[0];
	(myP5.shared.renderQueue[layer] || (myP5.shared.renderQueue[layer] = [])).push(ev.value);
	myP5.shared.lastDrawCall = ev.value;

	if (ev.value.name === 'pop') {
		myP5.shared.layerStack.shift();
	}

	ev.preventDefault();
	myP5.emit('rq.enqueue:after', ev.value, false);
});

myP5.on('rq.render:before', (ev) =>
	ev.value.sort((a, b) => (+a) - (+b))
);

myP5.on('rq.render', (ev) => {
	myP5.emit('ly.layer:before', ev.value, false);
	const renderLayer = myP5.shared.renderQueue[ev.value]; // FIFO queue
	if (myP5.emit('ly.layer', ev.value)) {
		renderLayer.forEach(drawCall => {
			myP5.emit('rq.drawCall:before', drawCall, false);
			if (myP5.emit('rq.drawCall', drawCall)) {
				drawCall.fn(...drawCall.args);
				myP5.emit('rq.drawCall:after', drawCall, false);
			}
		});
		myP5.emit('ly.layer:after', ev.value, false);
	}
	ev.preventDefault();
});
