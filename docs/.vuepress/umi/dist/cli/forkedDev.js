"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const constants_1 = require("../constants");
const service_1 = require("../service/service");
const node_1 = require("./node");
const printHelp_1 = require("./printHelp");
(0, node_1.setNodeTitle)(`${constants_1.FRAMEWORK_NAME}-dev`);
(0, node_1.setNoDeprecation)();
(async () => {
    try {
        const args = (0, utils_1.yParser)(process.argv.slice(2));
        const service = new service_1.Service();
        await service.run2({
            name: constants_1.DEV_COMMAND,
            args,
        });
        let closed = false;
        // kill(2) Ctrl-C
        process.once('SIGINT', () => onSignal('SIGINT'));
        // kill(3) Ctrl-\
        process.once('SIGQUIT', () => onSignal('SIGQUIT'));
        // kill(15) default
        process.once('SIGTERM', () => onSignal('SIGTERM'));
        function onSignal(signal) {
            if (closed)
                return;
            closed = true;
            // 退出时触发插件中的 onExit 事件
            service.applyPlugins({
                key: 'onExit',
                args: {
                    signal,
                },
            });
            process.exit(0);
        }
    }
    catch (e) {
        utils_1.logger.fatal(e);
        (0, printHelp_1.printHelp)();
        process.exit(1);
    }
})();
