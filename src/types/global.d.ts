
///<reference path="../../TSDef/p5.global-mode.d.ts" />

// Polyfills
interface Array<T> {
    forReverse(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
}

// Extensions
declare function vec(x?: number, y?: number, z?: number): p5.Vector;

declare function polygon(...coords: number[]): void;
p5.prototype.polygon = polygon;

declare function spline(...coords: number[]): void;
p5.prototype.spline = spline;

// Public values
interface PublicObject {
    // frame-debug
    /**
     * Frame profiler, set to a number of frames to profile (high number = very laggy)
     */
    DEBUG_FRAME?: number;

    // layer
    /**
     * @returns The current layer
     */
    layer: (layer?: number) => number,

    // drag-point
    LAYER_GIZMO: number;
    CONTROLLER_SIZE: number;
    /**
     * Creates a point which can be moved on the screen.
     * @returns The current pos of the point handle
     */
    dragPoint: (id: string, pos: p5.Vector, pointColor?: p5.Color, options?: { lockX?: boolean, lockY?: boolean }) => p5.Vector;

    // drag-ellipse
    /**
     * Draws an editable ellipse.
     */
    dragEllipse: (id: string, x: number, y: number, w: number, h: number) => void;
};

declare class MyP5 {

    public public: PublicObject;
    public shared: any;
    public plugins: string[];
};

declare const myP5: PublicObject;
