import { myP5 } from '../../base.js';
import './render-queue.js';

myP5.on('init', () => {
	myP5.registerPlugin('frame-debug');
});

let doProfile = false;

myP5.on('rq.render:before', () => {
	doProfile = myP5.public.DEBUG_FRAME > 0;
	if (doProfile) {
		console.groupCollapsed(`Frame ${myP5.shared.frameCount}`);
	}
});

myP5.on('ly.layer:before', (ev) => {
	if (doProfile) {
		console.groupCollapsed(`Layer ${ev.value}`);
	}
});

myP5.on('rq.drawCall:after', (ev) => {
	if (doProfile) {
		console.log(`${ev.value.name}(${(ev.value.args || [])
			.map(a => a.toString()).join(', ')})`);
	}
});

myP5.on('ly.layer:after', () => {
	if (doProfile) {
		console.groupEnd();
	}
});

myP5.on('rq.render:after', () => {
	if (doProfile) {
		console.groupEnd();
		myP5.public.DEBUG_FRAME--;
	}
});
