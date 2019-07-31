"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applicationinsights_web_1 = require("@microsoft/applicationinsights-web");
var applicationinsights_react_js_1 = require("@microsoft/applicationinsights-react-js");
var TelemetryService = /** @class */ (function () {
    function TelemetryService() {
        this.reactPlugin = new applicationinsights_react_js_1.ReactPlugin();
        this.appInsights = undefined;
    }
    TelemetryService.prototype.initialize = function (reactPluginConfig) {
        var _a;
        var INSTRUMENTATION_KEY = 'a450a2bc-72cd-45a6-8e75-f3afed3b2382'; // Enter your instrumentation key here
        this.appInsights = new applicationinsights_web_1.ApplicationInsights({
            config: {
                instrumentationKey: INSTRUMENTATION_KEY,
                maxBatchInterval: 0,
                disableFetchTracking: false,
                extensions: [this.reactPlugin],
                extensionConfig: (_a = {},
                    _a[this.reactPlugin.identifier] = reactPluginConfig,
                    _a)
            }
        });
        this.appInsights.loadAppInsights();
    };
    return TelemetryService;
}());
exports.ai = new TelemetryService();
//# sourceMappingURL=TelemetryService.js.map