"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = exports.ApplyPluginsType = void 0;
const utils_1 = require("./utils");
var ApplyPluginsType;
(function (ApplyPluginsType) {
    ApplyPluginsType["compose"] = "compose";
    ApplyPluginsType["modify"] = "modify";
    ApplyPluginsType["event"] = "event";
})(ApplyPluginsType = exports.ApplyPluginsType || (exports.ApplyPluginsType = {}));
class PluginManager {
    constructor(opts) {
        this.hooks = {};
        this.opts = opts;
    }
    register(plugin) {
        (0, utils_1.assert)(plugin.apply, `plugin register failed, apply must supplied`);
        Object.keys(plugin.apply).forEach((key) => {
            (0, utils_1.assert)(this.opts.validKeys.indexOf(key) > -1, `register failed, invalid key ${key} ${plugin.path ? `from plugin ${plugin.path}` : ''}.`);
            this.hooks[key] = (this.hooks[key] || []).concat(plugin.apply[key]);
        });
    }
    getHooks(keyWithDot) {
        const [key, ...memberKeys] = keyWithDot.split('.');
        let hooks = this.hooks[key] || [];
        if (memberKeys.length) {
            hooks = hooks
                .map((hook) => {
                try {
                    let ret = hook;
                    for (const memberKey of memberKeys) {
                        ret = ret[memberKey];
                    }
                    return ret;
                }
                catch (e) {
                    return null;
                }
            })
                .filter(Boolean);
        }
        return hooks;
    }
    applyPlugins({ key, type, initialValue, args, async, }) {
        const hooks = this.getHooks(key) || [];
        if (args) {
            (0, utils_1.assert)(typeof args === 'object', `applyPlugins failed, args must be plain object.`);
        }
        if (async) {
            (0, utils_1.assert)(type === ApplyPluginsType.modify || type === ApplyPluginsType.event, `async only works with modify and event type.`);
        }
        switch (type) {
            case ApplyPluginsType.modify:
                if (async) {
                    return hooks.reduce(async (memo, hook) => {
                        (0, utils_1.assert)(typeof hook === 'function' ||
                            typeof hook === 'object' ||
                            (0, utils_1.isPromiseLike)(hook), `applyPlugins failed, all hooks for key ${key} must be function, plain object or Promise.`);
                        if ((0, utils_1.isPromiseLike)(memo)) {
                            memo = await memo;
                        }
                        if (typeof hook === 'function') {
                            const ret = hook(memo, args);
                            if ((0, utils_1.isPromiseLike)(ret)) {
                                return await ret;
                            }
                            else {
                                return ret;
                            }
                        }
                        else {
                            if ((0, utils_1.isPromiseLike)(hook)) {
                                hook = await hook;
                            }
                            return { ...memo, ...hook };
                        }
                    }, (0, utils_1.isPromiseLike)(initialValue)
                        ? initialValue
                        : Promise.resolve(initialValue));
                }
                else {
                    return hooks.reduce((memo, hook) => {
                        (0, utils_1.assert)(typeof hook === 'function' || typeof hook === 'object', `applyPlugins failed, all hooks for key ${key} must be function or plain object.`);
                        if (typeof hook === 'function') {
                            return hook(memo, args);
                        }
                        else {
                            // TODO: deepmerge?
                            return { ...memo, ...hook };
                        }
                    }, initialValue);
                }
            case ApplyPluginsType.event:
                return (async () => {
                    for (const hook of hooks) {
                        (0, utils_1.assert)(typeof hook === 'function', `applyPlugins failed, all hooks for key ${key} must be function.`);
                        const ret = hook(args);
                        if (async && (0, utils_1.isPromiseLike)(ret)) {
                            await ret;
                        }
                    }
                })();
            case ApplyPluginsType.compose:
                return () => {
                    return (0, utils_1.compose)({
                        fns: hooks.concat(initialValue),
                        args,
                    })();
                };
        }
    }
    static create(opts) {
        const pluginManager = new PluginManager({
            validKeys: opts.validKeys,
        });
        opts.plugins.forEach((plugin) => {
            pluginManager.register(plugin);
        });
        return pluginManager;
    }
}
exports.PluginManager = PluginManager;
// plugins meta info (in tmp file)
// hooks api: usePlugin
