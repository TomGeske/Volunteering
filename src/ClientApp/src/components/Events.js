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
var react_bingmaps_1 = require("react-bingmaps");
var TelemetryService_1 = require("../TelemetryService");
var Config_1 = require("../Config");
var adalConfig_1 = require("../adalConfig");
var Events = /** @class */ (function (_super) {
    __extends(Events, _super);
    function Events(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            loading: true,
            events: [],
        };
        _this.state = {
            events: [],
            loading: true,
        };
        var token = adalConfig_1.authContext.getCachedToken(adalConfig_1.adalConfig.endpoints.api);
        fetch('api/Event/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }).then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState({
                events: data,
                loading: false,
            });
        });
        return _this;
    }
    Events.renderEventsTable = function (_events) {
        return (_events.map(function (_event) { return (React.createElement(reactstrap_1.Row, { key: _event.id, className: "justify-content-md-center" },
            React.createElement(reactstrap_1.Col, { sm: true },
                React.createElement("h3", null, _event.name),
                React.createElement("p", null,
                    React.createElement("b", null, "Event organizer:"),
                    "\u00A0",
                    _event.ownerName1,
                    "\u00A0",
                    _event.ownerName2),
                React.createElement("p", null,
                    React.createElement("b", null, "Event type:"),
                    "\u00A0",
                    _event.eventType)),
            React.createElement(reactstrap_1.Col, { sm: true },
                React.createElement(react_router_dom_1.Link, { className: "btn btn-primary mb1 bg-green", to: { pathname: '/eventdetails/' + _event.id } }, "Details"),
                React.createElement("br", null),
                React.createElement("b", null, "Date:"),
                "\u00A0",
                new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString(),
                "\u00A0-\u00A0",
                new Date(Date.parse(_event.eventEndDate.toString())).toLocaleDateString()),
            React.createElement(reactstrap_1.Col, null,
                React.createElement("div", { className: "map-small" },
                    React.createElement(react_bingmaps_1.ReactBingmaps, { id: _event.id, bingmapKey: Config_1.default.BING_API_KEY, boundary: _event.boundary, mapOptions: { showLocateMeButton: false, showMapTypeSelector: false }, className: "map-small" }))))); }));
    };
    Events.bindBoundery = function (events) {
        for (var i = 0; i < events.length; i++) {
            events[i].boundary = {
                search: events[i].eventLocation,
                polygonStyle: {
                    fillColor: 'rgba(161,224,255,0.4)',
                    strokeColor: '#a495b2',
                    strokeThickness: 2,
                },
                option: {
                    entityType: 'PopulatedPlace',
                },
            };
        }
        return events;
    };
    Events.prototype.render = function () {
        var contents = this.state.loading
            ? React.createElement("p", null,
                React.createElement("em", null, "Loading..."))
            : Events.renderEventsTable(Events.bindBoundery(this.state.events));
        return (React.createElement("div", null,
            React.createElement("h1", { className: "text-center" }, "Upcoming events"),
            React.createElement("a", { className: "btn btn-primary btn-lg", href: "./newevent", role: "button" }, "Create event \u00BB"),
            React.createElement("br", null),
            contents));
    };
    return Events;
}(React.Component));
exports.Events = Events;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, Events);
//# sourceMappingURL=Events.js.map