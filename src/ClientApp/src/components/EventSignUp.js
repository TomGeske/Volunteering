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
var adalConfig_1 = require("../adalConfig");
var EventSignUp = /** @class */ (function (_super) {
    __extends(EventSignUp, _super);
    function EventSignUp(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            show: false,
        };
        _this.handleShow = _this.handleShow.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
        _this.handleRegister = _this.handleRegister.bind(_this);
        return _this;
    }
    EventSignUp.prototype.handleRegister = function () {
        this.handleClose();
        // call Registration and pass user & event
        var token = adalConfig_1.authContext.getCachedToken('140b4e02-5a76-4c4f-aecd-5b7562f93e62');
        //  .subscribe(result => console.log(result));
        if (token == null) {
            console.log('valid token aquired.');
        }
        console.log(token);
        fetch("api/Event/AddRegistration/" + this.props.event.id, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        //fetch(`api/Event/AddRegistration/${this.props.event.id}`)
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
                React.createElement(reactstrap_1.ModalHeader, null,
                    "Event Registration ",
                    this.props.event.name),
                React.createElement(reactstrap_1.ModalBody, null,
                    "Please, confirm:",
                    React.createElement("br", null),
                    React.createElement("ol", null,
                        React.createElement("li", null, "You have approval from your line manager"),
                        React.createElement("li", null,
                            "You entered your volunteering days in ",
                            React.createElement("a", { href: "https://msvacation" }, "https://msvacation")))),
                React.createElement(reactstrap_1.ModalFooter, null,
                    React.createElement(reactstrap_1.Button, { variant: "secondary", onClick: this.handleClose }, "Cancel"),
                    React.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleRegister }, "I agree")))));
    };
    return EventSignUp;
}(React.Component));
exports.default = EventSignUp;
//# sourceMappingURL=EventSignUp.js.map