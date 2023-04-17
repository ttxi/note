"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHelp = void 0;
const utils_1 = require("@umijs/utils");
function printHelp() {
    utils_1.logger.fatal('A complete log of this run can be found in:');
    utils_1.logger.fatal(utils_1.logger.getLatestLogFilePath());
    utils_1.logger.fatal('Consider reporting a GitHub issue on https://github.com/umijs/umi/issues');
}
exports.printHelp = printHelp;
