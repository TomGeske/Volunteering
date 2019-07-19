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
var reactstrap_1 = require("reactstrap");
var NavMenu_1 = require("./NavMenu");
var Footer_1 = require("./Footer");
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Layout.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(NavMenu_1.NavMenu, { collapsed: true }),
            React.createElement("div", { className: "jumbotron" },
                React.createElement(reactstrap_1.Container, null,
                    React.createElement("h1", { className: "display-4 text-center" }, "Microsoft Volunteering"),
                    React.createElement("p", { className: "small-banner text-center" }, "Feel good while doing good"))),
            React.createElement(reactstrap_1.Container, null, this.props.children),
            React.createElement(Footer_1.Footer, null)));
    };
    return Layout;
}(React.Component));
exports.Layout = Layout;
//# sourceMappingURL=Layout.js.map