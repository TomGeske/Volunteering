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
var applicationinsights_react_js_1 = require("@microsoft/applicationinsights-react-js");
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var reactstrap_1 = require("reactstrap");
var TelemetryService_1 = require("../TelemetryService");
var adalConfig_1 = require("../adalConfig");
var EventType;
(function (EventType) {
    EventType[EventType["Registered"] = 0] = "Registered";
    EventType[EventType["Owned"] = 1] = "Owned";
})(EventType || (EventType = {}));
var MyEvents = /** @class */ (function (_super) {
    __extends(MyEvents, _super);
    function MyEvents(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            registeredEvents: [],
            ownedEvents: [],
            loadingOwned: false,
            loadingRegistered: false,
        };
        _this.state = {
            registeredEvents: [],
            ownedEvents: [],
            loadingRegistered: true,
            loadingOwned: true
        };
        adalConfig_1.adalApiFetch("api/Event/GetUserRegisteredEvents/")
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState({
                registeredEvents: data,
                loadingRegistered: false,
            });
        });
        adalConfig_1.adalApiFetch("api/Event/GetUserOwnedEvents/")
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState({
                ownedEvents: data,
                loadingOwned: false,
            });
        });
        return _this;
    }
    MyEvents.renderEventButton = function (type, id) {
        if (type === EventType.Registered) {
            return (React.createElement(react_router_dom_1.Link, { className: "btn btn-primary mb3 bg-green", to: {
                    pathname: '/eventdetails/' + id
                } }, "Details"));
        }
        else {
            return (React.createElement(react_router_dom_1.Link, { className: "btn btn-primary mb3 bg-green", to: {
                    pathname: '/editevent/' + id
                } }, "EditEvent"));
        }
    };
    MyEvents.renderEventsTable = function (_events, type) {
        var _this = this;
        return (React.createElement(reactstrap_1.Container, null,
            React.createElement(reactstrap_1.Table, { striped: true, bordered: true, hover: true, size: "sm" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Name"),
                        React.createElement("th", null, "Company"),
                        React.createElement("th", null, "# Volunteers"),
                        React.createElement("th", null, " Registration Date"),
                        React.createElement("th", null))),
                React.createElement("tbody", null, _events.map(function (_event) { return (React.createElement("tr", { key: _event.id, className: "justify-content-md-center" },
                    React.createElement("td", null,
                        React.createElement("p", null, _event.name)),
                    React.createElement("td", null,
                        React.createElement("p", null, _event.company)),
                    React.createElement("td", null,
                        React.createElement("p", null, _event.registrations == null ? 0 : _event.registrations.length)),
                    React.createElement("td", null,
                        React.createElement("p", null, new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString())),
                    React.createElement("td", { align: "right" }, _this.renderEventButton(type, _event.id)))); })))));
    };
    MyEvents.prototype.componentDidMount = function () {
        document.title = "MS Volunteering: My Profile";
    };
    MyEvents.prototype.render = function () {
        var registeredEvents = this.state.loadingRegistered
            ? React.createElement("p", null,
                React.createElement("em", null, "Loading..."))
            : MyEvents.renderEventsTable(this.state.registeredEvents, EventType.Registered);
        var ownedEvents = this.state.loadingOwned
            ? React.createElement("p", null,
                React.createElement("em", null, "Loading..."))
            : MyEvents.renderEventsTable(this.state.ownedEvents, EventType.Owned);
        return (React.createElement("div", null,
            React.createElement("h1", { className: "text-left" }, "Events I registered for"),
            React.createElement("br", null),
            registeredEvents,
            React.createElement("h1", { className: "text-left" }, "Events I own"),
            React.createElement("br", null),
            ownedEvents));
    };
    return MyEvents;
}(React.Component));
exports.MyEvents = MyEvents;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, MyEvents);
//# sourceMappingURL=MyEvents.js.map