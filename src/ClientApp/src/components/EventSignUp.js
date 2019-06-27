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
var react_1 = require("react");
var reactstrap_1 = require("reactstrap");
var EventSignUp = /** @class */ (function (_super) {
    __extends(EventSignUp, _super);
    function EventSignUp(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { show: false };
        _this.handleShow = _this.handleShow.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
        return _this;
    }
    EventSignUp.prototype.handleClose = function () {
        this.state.show = false;
    };
    EventSignUp.prototype.handleShow = function () {
        this.state.show = true;
    };
    EventSignUp.prototype.render = function () {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleShow }, "Launch demo modal"),
            react_1.default.createElement(reactstrap_1.Modal, { show: this.state.show, onHide: this.handleClose },
                react_1.default.createElement(reactstrap_1.Modal.Header, { closeButton: true },
                    react_1.default.createElement(reactstrap_1.Modal.Title, null, "Modal heading")),
                react_1.default.createElement(reactstrap_1.Modal.Body, null, "Woohoo, you're reading this text in a modal!"),
                react_1.default.createElement(reactstrap_1.Modal.Footer, null,
                    react_1.default.createElement(reactstrap_1.Button, { variant: "secondary", onClick: this.handleClose }, "Close"),
                    react_1.default.createElement(reactstrap_1.Button, { variant: "primary", onClick: this.handleClose }, "Save Changes")))));
    };
    return EventSignUp;
}(react_1.default.Component));
exports.default = EventSignUp;
//# sourceMappingURL=EventSignUp.js.map