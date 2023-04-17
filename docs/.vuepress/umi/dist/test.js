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
exports.configUmiAlias = exports.getUmiAlias = exports.getAliasPathWithKey = void 0;
const fs_1 = require("fs");
const service_1 = require("./service/service");
__exportStar(require("@umijs/test"), exports);
function getAliasPathWithKey(alias, key) {
    if (alias[key]) {
        return getAliasPathWithKey(alias, alias[key]);
    }
    const aliasKeys = Object.keys(alias);
    const keyStartedWith = aliasKeys.find((k) => !k.endsWith('$') && key.startsWith(`${k}/`));
    if (keyStartedWith) {
        const realPath = alias[keyStartedWith];
        const newKey = realPath + key.slice(keyStartedWith.length);
        return getAliasPathWithKey(alias, newKey);
    }
    else {
        return key;
    }
}
exports.getAliasPathWithKey = getAliasPathWithKey;
let service;
async function getUmiAlias() {
    if (!service) {
        service = new service_1.Service();
        await service.run2({
            name: 'setup',
            args: { quiet: true },
        });
    }
    return service.config.alias;
}
exports.getUmiAlias = getUmiAlias;
async function configUmiAlias(config) {
    config.moduleNameMapper || (config.moduleNameMapper = {});
    const alias = await getUmiAlias();
    for (const key of Object.keys(alias)) {
        const aliasPath = getAliasPathWithKey(alias, key);
        if (key.endsWith('$')) {
            config.moduleNameMapper[`^${key}`] = aliasPath;
        }
        else if ((0, fs_1.existsSync)(aliasPath) && (0, fs_1.statSync)(aliasPath).isDirectory()) {
            config.moduleNameMapper[`^${key}/(.*)$`] = `${aliasPath}/$1`;
            config.moduleNameMapper[`^${key}$`] = aliasPath;
        }
        else {
            config.moduleNameMapper[`^${key}$`] = aliasPath;
        }
    }
    return config;
}
exports.configUmiAlias = configUmiAlias;
