"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var applicationinsights_react_js_1 = require("@microsoft/applicationinsights-react-js");
var TelemetryService_1 = require("../TelemetryService");
var Footer = /** @class */ (function (_super) {
    __extends(Footer, _super);
    function Footer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Footer.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("footer", { className: "footer font-small mt-auto pt-4" },
                React.createElement("div", { className: "container-fluid text-center text-md-left" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-md-6 mt-md-0 mt-3" },
                            React.createElement("h2", { className: "feedback-header text-uppercase" }, "Do you have feedback?"),
                            React.createElement("p", null,
                                "Please ",
                                React.createElement("a", { className: "footer-anchor", href: "https://github.com/TomGeske/Volunteering/issues/new" }, "file an issue"))),
                        React.createElement("hr", { className: "clearfix w-100 d-md-none pb-3" }),
                        React.createElement("div", { className: "col-md-3 mb-md-0 mb-3" }),
                        React.createElement("div", { className: "col-md-3 mb-md-0 mb-3" },
                            React.createElement("span", null,
                                "Microsoft confidential. For use only by Microsoft employees and approved vendors working on\u200B\u200B\u200Bbehalf of\u200B\u200B Microsoft.\u00A0",
                                React.createElement("a", { className: "footer-anchor", href: "https://microsoft.sharepoint.com/teams/msdpn/sitepages/default.aspx" }, "Data protection notice\u200B\u200B."))))),
                React.createElement("div", { className: "footer-copyright text-center py-3" },
                    "\u00A9 Microsoft\u00A0",
                    new Date().getFullYear()))));
    };
    return Footer;
}(React.Component));
exports.Footer = Footer;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, Footer);
//# sourceMappingURL=Footer.js.map