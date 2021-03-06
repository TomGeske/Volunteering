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
var react_bingmaps_1 = require("react-bingmaps");
var reactstrap_1 = require("reactstrap");
var TelemetryService_1 = require("../TelemetryService");
var Config_1 = require("../Config");
var EventSignUp_1 = require("./EventSignUp");
var reactstrap_2 = require("reactstrap");
var adalConfig_1 = require("../adalConfig");
var EventDetails = /** @class */ (function (_super) {
    __extends(EventDetails, _super);
    function EventDetails(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            loading: true,
            event: {
                id: 'tbd',
                name: 'tbd',
                company: 'tbd',
                ownerName1: 'tbd',
                ownerName2: 'tbd',
                ownerEmail: 'tbd',
                department: 'tbd',
                country: 'tbd',
                eventLocation: 'tbd',
                eventdate: new Date(),
                eventEndDate: new Date(),
                startEventTime: 'tbd',
                endEventTime: 'tbd',
                url: 'tbd',
                description: 'tbd',
                mediaLink: 'tbd',
                registrations: [],
                eventType: 'tbd',
                pushpins: [],
                coordinates: {
                    longitude: 46.798333,
                    latitude: 8.231944,
                },
            },
        };
        _this.eventid = props.match.params.eventid;
        _this.refreshAttendeeList = _this.refreshAttendeeList.bind(_this);
        adalConfig_1.adalApiFetch("api/Event/" + _this.eventid)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState({
                event: data,
                loading: false,
            });
        });
        return _this;
    }
    EventDetails.prototype.renderEventDetails = function (_event) {
        if (document) {
            document.title = "MS Volunteering: " + _event.name;
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", { className: "text-center" }, _event.name),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Event Organisation: "),
                        React.createElement("a", { href: _event.url, title: _event.company }, _event.company))),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Date: "),
                        new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString(),
                        "\u00A0-\u00A0",
                        new Date(Date.parse(_event.eventEndDate.toString())).toLocaleDateString())),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement(EventSignUp_1.default, { event: _event, onRegister: this.refreshAttendeeList, onWithdraw: this.refreshAttendeeList }))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Microsoft Host: "),
                        React.createElement("a", { href: "mailto:" + _event.ownerEmail + "?subject=" + _event.name },
                            _event.ownerName1,
                            "\u00A0",
                            _event.ownerName2),
                        "\u00A0 (",
                        _event.department,
                        ")")),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Time: "),
                        _event.startEventTime,
                        "\u00A0-\u00A0",
                        _event.endEventTime)),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, this.renderMediaLink(_event.mediaLink))))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, null, _event.description)),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, null,
                    React.createElement("br", null))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, null,
                    React.createElement("b", null, "Meeting Point Location:"),
                    "\u00A0",
                    _event.eventLocation,
                    ",\u00A0",
                    _event.country,
                    React.createElement("div", { className: "map-large-frame" }, _event.coordinates !== null ?
                        React.createElement(react_bingmaps_1.ReactBingmaps, { id: "_map", bingmapKey: Config_1.default.BING_API_KEY, center: [_event.coordinates.latitude, _event.coordinates.longitude], pushPins: _event.pushpins, zoom: 9, className: "map-large" })
                        :
                            React.createElement(reactstrap_2.Alert, { color: "warning" }, "Map is not available. Location coordinates not found.")))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, null,
                    React.createElement("br", null))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, null,
                    React.createElement("h4", null,
                        React.createElement("b", null, "Registered volunteers")),
                    React.createElement(reactstrap_1.Table, { striped: true, bordered: true, hover: true, size: "sm" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Name"),
                                React.createElement("th", null, "Date of Registration"))),
                        React.createElement("tbody", null, this.renderRegistrationBody(_event)))))));
    };
    //TODO
    EventDetails.prototype.refreshAttendeeList = function (reg) {
        this.setState({
            loading: false
        });
    };
    EventDetails.prototype.renderRegistrationBody = function (_event) {
        if (_event.registrations === null || _event.registrations.length == 0) {
            return (React.createElement("tr", { className: "justify-content-md-center" },
                React.createElement("td", { colSpan: 2 },
                    React.createElement("p", null, "No registrations yet. Be the first."))));
        }
        else {
            return (_event.registrations.map(function (_registration) {
                return React.createElement("tr", { key: _registration.userId, className: "justify-content-md-center" },
                    React.createElement("td", null,
                        React.createElement("p", null,
                            React.createElement("a", { href: "mailto:" + _registration.userId },
                                _registration.name1,
                                "\u00A0",
                                _registration.name2))),
                    React.createElement("td", null,
                        React.createElement("p", null, new Date(Date.parse(_registration.createdTS.toString())).toLocaleDateString())));
            }));
        }
    };
    EventDetails.prototype.renderMediaLink = function (mediaLink) {
        if (mediaLink !== null && mediaLink !== '') {
            return (React.createElement("a", { href: mediaLink, target: "_blank" }, "Media Link"));
        }
        else {
            return (React.createElement(React.Fragment, null));
        }
    };
    EventDetails.prototype.bindPushPin = function (event) {
        if (event.coordinates !== null
            && event.coordinates.latitude !== null
            && event.coordinates.longitude !== null) {
            event.pushpins = [{
                    location: [event.coordinates.latitude, event.coordinates.longitude],
                    option: {
                        color: 'red'
                    }
                }];
        }
        return event;
    };
    EventDetails.prototype.componentDidMount = function () {
        document.title = "MS Volunteering: Loading details...";
    };
    EventDetails.prototype.render = function () {
        var contents = this.state.loading
            ? React.createElement("p", null,
                React.createElement("em", null, "Loading..."))
            : this.renderEventDetails(this.bindPushPin(this.state.event));
        return (React.createElement("div", null, contents));
    };
    return EventDetails;
}(React.Component));
exports.EventDetails = EventDetails;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, EventDetails);
//# sourceMappingURL=EventDetails.js.map