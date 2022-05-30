/// <reference path="../../types/global.d.ts" />

import { myP5 } from '../../base.js';
import './point.js';

myP5.on('init', () => {
	myP5.registerPlugin('drag-ellipse');
});

/**
 * Draws an editable ellipse.
 */
 myP5.public.dragEllipse = function(id, x, y, w, h) {
	let pPos = myP5.shared.dragHandles?.[id]?.pos;
	pPos && (pPos = vec(pPos.x, pPos.y));
	const eHeight = (pPos?.y - myP5.shared.dragHandles?.[`${id}.h`]?.pos?.y) || -h,
		eWeight = (pPos?.x - myP5.shared.dragHandles?.[`${id}.w`]?.pos?.x) || w;
	const center = myP5.public.dragPoint(id, vec(x, y));
	pPos?.sub(center);
	if (pPos?.x || pPos?.y) {
		myP5.shared.dragHandles[`${id}.h`]?.pos?.sub(pPos);
		myP5.shared.dragHandles[`${id}.w`]?.pos?.sub(pPos);
	}
	myP5.public.dragPoint(`${id}.w`, vec(center.x+eWeight, center.y), undefined, { lockY: true });
	myP5.public.dragPoint(`${id}.h`, vec(center.x, center.y+eHeight), undefined, { lockX: true });
	ellipse(center.x, center.y, 2*abs(eWeight), 2*abs(eHeight));
}