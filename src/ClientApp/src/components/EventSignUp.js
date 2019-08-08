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
            uiState: "Open",
            show: false,
        };
        _this.handleShow = _this.handleShow.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
        _this.handleRegister = _this.handleRegister.bind(_this);
        return _this;
    }
    EventSignUp.prototype.handleRegister = function () {
        var _this = this;
        this.setState({ uiState: 'Processing' });
        adalConfig_1.adalApiFetch("api/Event/AddRegistration/" + this.props.event.id)
            .then(function (response) {
            if (response.status === 200 || response.status === 201) {
                _this.setState({ uiState: 'registration_successfull' });
                var newRegistration = {
                    userId: adalConfig_1.authContext.getCachedUser().userName,
                    createdTS: new Date(Date.now()),
                    name1: adalConfig_1.authContext.getCachedUser().userName,
                    name2: adalConfig_1.authContext.getCachedUser().profile.lastName,
                };
                _this.props.event.registrations.push(newRegistration);
                if (_this.props.onRegister) {
                    _this.props.onRegister(newRegistration);
                }
            }
            else {
                _this.setState({ uiState: 'registration_failed' });
            }
        });
    };
    EventSignUp.prototype.handleClose = function () {
        if (this.state.uiState === 'registration_successfull') {
            this.setState({ show: false });
        }
        else {
            this.setState({ show: false });
        }
    };
    EventSignUp.prototype.handleShow = function () {
        this.setState({ show: true });
    };
    EventSignUp.prototype.renderStatusMessages = function () {
        if (this.state.uiState === 'registration_successfull') {
            return (React.createElement(reactstrap_1.Alert, { color: "success" }, "Registration successfull"));
        }
        else if (this.state.uiState === 'registration_failed') {
            return (React.createElement(reactstrap_1.Alert, { color: "danger" }, "Registration failed. Please try again later."));
        }
        else {
            return (React.createElement(React.Fragment, null));
        }
    };
    EventSignUp.prototype.IsRegistered = function () {
        if (this.props.event.registrations == null) {
            return false;
        }
        var userId = adalConfig_1.authContext.getCachedUser().userName;
        for (var i = 0; i < this.props.event.registrations.length; i++) {
            if (this.props.event.registrations[i].userId === userId) {
                return true;
            }
        }
        return false;
    };
    EventSignUp.prototype.render = function () {
        if (this.IsRegistered()) {
            return (React.createElement("p", null,
                React.createElement("b", null, "You are registered")));
        }
        else {
            return (React.createElement(React.Fragment, null,
                React.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleShow }, "Register"),
                React.createElement(reactstrap_1.Modal, { isOpen: this.state.show, defaultChecked: true },
                    React.createElement(reactstrap_1.ModalHeader, null,
                        "Event Registration:\u00A0",
                        this.props.event.name),
                    React.createElement(reactstrap_1.ModalBody, null,
                        this.renderStatusMessages(),
                        "Please, confirm:",
                        React.createElement("br", null),
                        React.createElement("ol", null,
                            React.createElement("li", null, "You have approval from your line manager"),
                            React.createElement("li", null,
                                "You entered your volunteering days in ",
                                React.createElement("a", { href: "https://msvacation", target: "_blank" }, "https://msvacation")))),
                    React.createElement(reactstrap_1.ModalFooter, null,
                        React.createElement(reactstrap_1.Button, { variant: "secondary", onClick: this.handleClose }, "Close"),
                        React.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleRegister, disabled: this.state.uiState === "Processing" || this.state.uiState === "registration_successfull" ? true : false }, this.state.uiState === "Processing" ? 'Registering' : 'I agree')))));
        }
    };
    return EventSignUp;
}(React.Component));
exports.default = EventSignUp;
//# sourceMappingURL=EventSignUp.js.map