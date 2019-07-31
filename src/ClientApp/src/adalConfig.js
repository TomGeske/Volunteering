"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_adal_1 = require("react-adal");
exports.adalConfig = {
    tenant: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    clientId: '140b4e02-5a76-4c4f-aecd-5b7562f93e62',
    endpoints: {
        api: '140b4e02-5a76-4c4f-aecd-5b7562f93e62',
    },
    postLogoutRedirectUri: window.location.origin,
    cacheLocation: "localStorage",
};
exports.authContext = new react_adal_1.AuthenticationContext(exports.adalConfig);
exports.adalApiFetch = function (fetch, url, options) { return react_adal_1.adalFetch(exports.authContext, exports.adalConfig.endpoints.api, fetch, url, options); };
exports.withAdalLoginApi = react_adal_1.withAdalLogin(exports.authContext, exports.adalConfig.endpoints.api);
//# sourceMappingURL=adalConfig.js.map