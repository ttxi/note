"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCwd = void 0;
const path_1 = require("path");
function getCwd() {
    const cwd = process.cwd();
    const appRoot = process.env.APP_ROOT;
    if (appRoot) {
        return (0, path_1.isAbsolute)(appRoot) ? appRoot : (0, path_1.join)(cwd, appRoot);
    }
    return cwd;
}
exports.getCwd = getCwd;
