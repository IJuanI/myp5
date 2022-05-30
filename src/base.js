/// <reference path="types/global.d.ts" />

import './polyfills.js';
import * as ext from './extensions/index.js';

class MyP5 extends EventTarget {

    constructor() {
        super();

        this.addExtensions();

        this.plugins = [];

        this.shared = {};
        /** @type {PublicObject} */
        // @ts-ignore
        this.public = {};

        this.addOverrides();
    }

    addExtensions() {
        for (const [key, value] of Object.entries(ext)) {
            globalThis[key] = value;
        }
    }
    
    addOverrides() {
        const oldDraw = globalThis.draw;
        globalThis.draw = function() {
            myP5.shared.cursor = ARROW;
            oldDraw.bind(this)();
            cursor(myP5.shared.cursor);
        }
    }

    /**
     * @param {string} name 
     * @returns {boolean}
     */
    hasPlugin(name) {
        return this.plugins.includes(name);
    }

    /**
     * @param {string} name 
     */
     registerPlugin(name) {
        if (!this.hasPlugin(name)) {
            this.plugins.push(name);
            this.emit('plugin:register', name, false);
        }
    }

    /**
     * @param {string} name 
     * @param {(ev: MyP5.Event) => void} callback 
     */
    // TODO: Might be registering calls twice when a plugin is loaded twice
    on(name, callback) {
        // @ts-ignore
        this.addEventListener(name, callback);
    }

    /**
     * @param {string} name
     * @param {*} payload
     * @param {boolean} cancelable
     * @returns {boolean} True for continue, false for canceled
     */
    emit(name, payload, cancelable = true) {
        const ev = new MyP5.Event(name, payload, cancelable);
        this.dispatchEvent(ev);
        return !ev.defaultPrevented;
    }
}

MyP5.Event = class extends globalThis.Event {
    /**
     * @param {string} name
     * @param {*} payload
     * @param {boolean} cancelable
     */
    constructor(name, payload, cancelable) {
        super(name, {
            cancelable: cancelable
        });
        this.value = payload;
    }
}

globalThis._myP5 = globalThis._myP5 || new MyP5();
// @ts-ignore
globalThis.myP5 = globalThis._myP5.public;

window.onload = function() {
    myP5.emit('init', this, false);
};

/** @type {MyP5} */
export const myP5 = globalThis._myP5;
