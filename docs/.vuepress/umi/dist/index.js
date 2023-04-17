"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineMock = exports.defineConfig = exports.run = void 0;
var cli_1 = require("./cli/cli");
Object.defineProperty(exports, "run", { enumerable: true, get: function () { return cli_1.run; } });
var defineConfig_1 = require("./defineConfig");
Object.defineProperty(exports, "defineConfig", { enumerable: true, get: function () { return defineConfig_1.defineConfig; } });
var defineMock_1 = require("./defineMock");
Object.defineProperty(exports, "defineMock", { enumerable: true, get: function () { return defineMock_1.defineMock; } });
__exportStar(require("./service/service"), exports);
