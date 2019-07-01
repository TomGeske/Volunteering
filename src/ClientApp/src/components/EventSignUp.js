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
var EventSignUp = /** @class */ (function (_super) {
    __extends(EventSignUp, _super);
    function EventSignUp(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { show: false };
        _this.handleShow = _this.handleShow.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
        _this.handleRegister = _this.handleRegister.bind(_this);
        return _this;
    }
    EventSignUp.prototype.handleRegister = function () {
        this.handleClose();
        // call Registration and pass user & event
    };
    EventSignUp.prototype.handleClose = function () {
        this.setState({ show: false });
    };
    EventSignUp.prototype.handleShow = function () {
        this.setState({ show: true });
    };
    EventSignUp.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleShow }, "Register"),
            React.createElement(reactstrap_1.Modal, { isOpen: this.state.show, defaultChecked: true },
                React.createElement(reactstrap_1.ModalHeader, null, "Event Registration"),
                React.createElement(reactstrap_1.ModalBody, null,
                    "Please, confirm that",
                    React.createElement("br", null),
                    "1. You have approval from your line manager ",
                    React.createElement("br", null),
                    "2. You entered your vacation in ",
                    React.createElement("a", { href: "https://msvacation" }),
                    React.createElement("br", null)),
                React.createElement(reactstrap_1.ModalFooter, null,
                    React.createElement(reactstrap_1.Button, { variant: "secondary", onClick: this.handleClose }, "Cancel"),
                    React.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleRegister }, "Register")))));
    };
    return EventSignUp;
}(React.Component));
exports.default = EventSignUp;
//# sourceMappingURL=EventSignUp.js.map