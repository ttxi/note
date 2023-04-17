"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const core_1 = require("@umijs/core");
const fs_1 = require("fs");
const path_1 = require("path");
const constants_1 = require("../constants");
const cwd_1 = require("./cwd");
class Service extends core_1.Service {
    constructor(opts) {
        process.env.UMI_DIR = (0, path_1.dirname)(require.resolve('../../package'));
        const cwd = (0, cwd_1.getCwd)();
        super({
            ...opts,
            env: process.env.NODE_ENV,
            cwd,
            defaultConfigFiles: constants_1.DEFAULT_CONFIG_FILES,
            frameworkName: constants_1.FRAMEWORK_NAME,
            presets: [require.resolve('@umijs/preset-umi'), ...((opts === null || opts === void 0 ? void 0 : opts.presets) || [])],
            plugins: [
                (0, fs_1.existsSync)((0, path_1.join)(cwd, 'plugin.ts')) && (0, path_1.join)(cwd, 'plugin.ts'),
                (0, fs_1.existsSync)((0, path_1.join)(cwd, 'plugin.js')) && (0, path_1.join)(cwd, 'plugin.js'),
            ].filter(Boolean),
        });
    }
    async run2(opts) {
        let name = opts.name;
        if ((opts === null || opts === void 0 ? void 0 : opts.args.version) || name === 'v') {
            name = 'version';
        }
        else if ((opts === null || opts === void 0 ? void 0 : opts.args.help) || !name || name === 'h') {
            name = 'help';
        }
        // TODO
        // initWebpack
        return await this.run({ ...opts, name });
    }
}
exports.Service = Service;
