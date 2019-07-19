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
var react_router_dom_1 = require("react-router-dom");
var reactstrap_1 = require("reactstrap");
var react_bootstrap_1 = require("react-bootstrap");
var adalConfig_1 = require("../adalConfig");
require("./NavMenu.css");
var NavMenu = /** @class */ (function (_super) {
    __extends(NavMenu, _super);
    function NavMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            collapsed: true
        };
        _this.toggleNavbar = _this.toggleNavbar.bind(_this);
        return _this;
    }
    NavMenu.prototype.toggleNavbar = function () {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    NavMenu.prototype.render = function () {
        return (React.createElement("header", null,
            React.createElement(reactstrap_1.Navbar, { className: "navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3", light: true, expand: "lg" },
                React.createElement(reactstrap_1.NavbarBrand, { tag: react_router_dom_1.Link, to: "/" },
                    React.createElement("img", { src: "images/microsoft-gray.png", width: "180", className: "d-inline-block align-top", alt: "Microsoft Logo" })),
                React.createElement(reactstrap_1.NavbarToggler, { onClick: this.toggleNavbar, className: "mr-2" }),
                React.createElement(reactstrap_1.Collapse, { className: "d-sm-inline-flex flex-sm-row-reverse", isOpen: !this.state.collapsed, navbar: true },
                    React.createElement("ul", { className: "navbar-nav flex-grow" },
                        React.createElement(reactstrap_1.NavItem, null,
                            React.createElement(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: "/events" }, "Events")),
                        React.createElement(reactstrap_1.NavItem, null,
                            React.createElement(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: "/myevents" },
                                "Signed in\u00A0",
                                adalConfig_1.authContext.getCachedUser().userName)),
                        React.createElement(reactstrap_1.NavItem, null,
                            React.createElement(reactstrap_1.Form, { inline: true },
                                React.createElement(react_bootstrap_1.FormControl, { type: "text", id: "search", name: "search", "aria-label": "Search", placeholder: "Search", className: "mr-sm-2" }))))))));
    };
    return NavMenu;
}(React.Component));
exports.NavMenu = NavMenu;
//# sourceMappingURL=NavMenu.js.map