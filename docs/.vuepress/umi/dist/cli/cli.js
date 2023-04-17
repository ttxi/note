"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const utils_1 = require("@umijs/utils");
const constants_1 = require("../constants");
const service_1 = require("../service/service");
const dev_1 = require("./dev");
const node_1 = require("./node");
const printHelp_1 = require("./printHelp");
async function run(opts) {
    (0, node_1.checkVersion)();
    (0, node_1.checkLocal)();
    (0, node_1.setNodeTitle)();
    (0, node_1.setNoDeprecation)();
    const args = (0, utils_1.yParser)(process.argv.slice(2), {
        alias: {
            version: ['v'],
            help: ['h'],
        },
        boolean: ['version'],
    });
    const command = args._[0];
    if ([constants_1.DEV_COMMAND, 'setup'].includes(command)) {
        process.env.NODE_ENV = 'development';
    }
    else if (command === 'build') {
        process.env.NODE_ENV = 'production';
    }
    if (opts === null || opts === void 0 ? void 0 : opts.presets) {
        process.env.UMI_PRESETS = opts.presets.join(',');
    }
    if (command === constants_1.DEV_COMMAND) {
        (0, dev_1.dev)();
    }
    else {
        try {
            await new service_1.Service().run2({
                name: args._[0],
                args,
            });
        }
        catch (e) {
            utils_1.logger.fatal(e);
            (0, printHelp_1.printHelp)();
            process.exit(1);
        }
    }
}
exports.run = run;
