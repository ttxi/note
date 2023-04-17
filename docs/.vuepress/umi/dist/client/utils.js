"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = exports.compose = exports.assert = void 0;
function assert(value, message) {
    if (!value)
        throw new Error(message);
}
exports.assert = assert;
function compose({ fns, args, }) {
    if (fns.length === 1) {
        return fns[0];
    }
    const last = fns.pop();
    return fns.reduce((a, b) => () => b(a, args), last);
}
exports.compose = compose;
function isPromiseLike(obj) {
    return !!obj && typeof obj === 'object' && typeof obj.then === 'function';
}
exports.isPromiseLike = isPromiseLike;
