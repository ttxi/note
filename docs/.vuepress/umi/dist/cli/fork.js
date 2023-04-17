"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const usedPorts = [];
function start({ scriptPath }) {
    const execArgv = process.execArgv.slice(0);
    const inspectArgvIndex = execArgv.findIndex((argv) => argv.includes('--inspect-brk'));
    if (inspectArgvIndex > -1) {
        const inspectArgv = execArgv[inspectArgvIndex];
        execArgv.splice(inspectArgvIndex, 1, inspectArgv.replace(/--inspect-brk=(.*)/, (_match, s1) => {
            let port;
            try {
                port = parseInt(s1) + 1;
            }
            catch (e) {
                port = 9230; // node default inspect port plus 1.
            }
            if (usedPorts.includes(port)) {
                port += 1;
            }
            usedPorts.push(port);
            return `--inspect-brk=${port}`;
        }));
    }
    const child = (0, child_process_1.fork)(scriptPath, process.argv.slice(2), { execArgv });
    child.on('message', (data) => {
        var _a;
        const { type, payload } = data || {};
        if (type === 'RESTART') {
            child.kill();
            if (payload === null || payload === void 0 ? void 0 : payload.port) {
                process.env.PORT = payload.port;
            }
            start({ scriptPath });
        }
        (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, data);
    });
    return child;
}
exports.default = start;
