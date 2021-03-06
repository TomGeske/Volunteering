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
        adalConfig_1.adalApiFetch('api/Event/')
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState({
                events: data,
                loading: false,
            });
        });
        return _this;
    }
    Events.renderEventsTable = function (_events) {
        return (_events.map(function (_event) { return (React.createElement(reactstrap_1.Container, { key: _event.id },
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 12 },
                    React.createElement("h3", null,
                        React.createElement(react_router_dom_1.Link, { "aria-label": _event.name, to: { pathname: '/eventdetails/' + _event.id } }, _event.name)))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 6 },
                    React.createElement("p", null,
                        React.createElement(reactstrap_1.Label, { className: "font-weight-bold" }, "Event organizer:"),
                        "\u00A0",
                        _event.ownerName1,
                        "\u00A0",
                        _event.ownerName2),
                    React.createElement("p", null,
                        React.createElement(reactstrap_1.Label, { className: "font-weight-bold" }, "Event type:"),
                        "\u00A0",
                        _event.eventType),
                    React.createElement("p", null,
                        React.createElement(reactstrap_1.Label, { className: "font-weight-bold" }, "Date:"),
                        "\u00A0",
                        new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString(),
                        "\u00A0-\u00A0",
                        new Date(Date.parse(_event.eventEndDate.toString())).toLocaleDateString())),
                React.createElement(reactstrap_1.Col, { md: 6 },
                    React.createElement("div", { className: "map-small", "aria-label": _event.eventLocation },
                        React.createElement(react_bingmaps_1.ReactBingmaps, { id: _event.id, bingmapKey: Config_1.default.BING_API_KEY, center: [_event.coordinates.latitude, _event.coordinates.longitude], pushPins: _event.pushpins, zoom: 9, mapOptions: { showLocateMeButton: false, showMapTypeSelector: false }, className: "map-small" })))))); }));
    };
    Events.bindPushPins = function (events) {
        for (var i = 0; i < events.length; i++) {
            var event_1 = events[i];
            if (event_1.coordinates !== null
                && event_1.coordinates.latitude !== null
                && event_1.coordinates.longitude !== null) {
                event_1.pushpins = [{
                        location: [event_1.coordinates.latitude, event_1.coordinates.longitude],
                        option: {
                            color: 'red'
                        }
                    }];
            }
        }
        return events;
    };
    Events.prototype.componentDidMount = function () {
        document.title = "MS Volunteering: All events";
    };
    Events.prototype.render = function () {
        var contents = this.state.loading
            ? React.createElement(React.Fragment, null)
            : Events.renderEventsTable(Events.bindPushPins(this.state.events));
        return (React.createElement("div", null,
            React.createElement("h2", { className: "text-center" },
                this.state.loading ? 'Loading ...' : this.state.events.length,
                " Upcoming events"),
            React.createElement("br", null),
            contents,
            React.createElement("br", null)));
    };
    return Events;
}(React.Component));
exports.Events = Events;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, Events);
//# sourceMappingURL=Events.js.map