/**
 * See the polyfill implementation of forEach in mdn web docs
 * https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#polyfill
 * 
 * @param {(value: any, index: number, array: any[]) => void} callback
 * @param {any} thisArg
 * @returns {void}
 */
Array.prototype['forReverse'] = function (callback, thisArg) {

	var T = arguments.length >= 2 ? thisArg : undefined;
	var kValue, O = Object(this), len = O.length >>> 0;

	let k = len;
	while (k-- > 0) {
		if (k in O) {
			kValue = O[k];
			callback.call(T, kValue, k, O);
		}
	}
};

export default null;
