/// <reference path="../../types/global.d.ts" />

import { myP5 } from '../../base.js';

myP5.on('init', () => {
	myP5.registerPlugin('drag-point');

    if (myP5.public.LAYER_GIZMO === undefined) {
        myP5.public.LAYER_GIZMO = 1000;
    }

    if (myP5.public.CONTROLLER_SIZE === undefined) {
        myP5.public.CONTROLLER_SIZE = 6;
    }

    myP5.shared.dragHandles = {};
});

myP5.public.dragPoint = function(id, pos, pointColor, { lockX = false, lockY = false } = {}) {

	const handle = myP5.shared.dragHandles[id]
        || (myP5.shared.dragHandles[id] =
            { pos: pos.copy(), color: color(random(255), 200, 90), state: {}, _flags: {} });

	push();
	myP5.public.layer(myP5.public.LAYER_GIZMO);
	if (handle.pos.dist(vec(pmouseX, pmouseY)) < myP5.public.CONTROLLER_SIZE) {
		if (!handle.state.hovered) {
			handle.state.hovered = true;
			handle._flags.hover = myP5.emit('dg.hover', id);
		}
		if (handle._flags.hover) {
			myP5.shared.cursor = HAND;
			if (mouseIsPressed) {
				if (!handle.state.dragging) {
					handle.state.dragging = true;
					handle._flags.drag = myP5.emit('dg.drag', id);
				}
				if (handle._flags.drag) {
					const target = vec(mouseX, mouseY);
					if (myP5.emit('dg.move', { id, target })) {
						if (!lockX) handle.pos.x = target.x;
						if (!lockY) handle.pos.y = target.y;
						myP5.emit('dg.move:after', id);
					}
				}
			}
		}
	} else if (handle.state.hovered) {
		handle.state.hovered = false;
		myP5.emit('dg.hover:end', id, false);
	}
	if (!mouseIsPressed && handle.state.dragging) {
		handle.state.dragging = false;
		myP5.emit('dg.drag:end', id, false);
	}

	if (!pointColor) {
		pointColor = handle.color;
		colorMode(HSB);
	}

	strokeWeight(myP5.public.CONTROLLER_SIZE);
	stroke(pointColor);
	if (myP5.emit('dg.draw', id)) {
		point(handle.pos.x, handle.pos.y);
		myP5.emit('dg.draw:after', id, false);
	}

	pop();

	return handle.pos;
}
