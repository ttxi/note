"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dev = void 0;
const fork_1 = __importDefault(require("./fork"));
function dev() {
    const child = (0, fork_1.default)({
        scriptPath: require.resolve('../../bin/forkedDev'),
    });
    // ref:
    // http://nodejs.cn/api/process/signal_events.html
    // https://lisk.io/blog/development/why-we-stopped-using-npm-start-child-processes
    process.on('SIGINT', () => {
        child.kill('SIGINT');
        // ref:
        // https://github.com/umijs/umi/issues/6009
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        child.kill('SIGTERM');
        process.exit(1);
    });
}
exports.dev = dev;
