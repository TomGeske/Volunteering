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
var EventDetails = /** @class */ (function (_super) {
    __extends(EventDetails, _super);
    function EventDetails(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            loading: true,
            event: {
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
                url: 'tbd',
                description: 'tbd'
            },
            boundary: {
                search: 'Switzerland',
                polygonStyle: {
                    fillColor: 'rgba(161,224,255,0.4)',
                    strokeColor: '#a495b2',
                    strokeThickness: 2,
                },
                option: {
                    entityType: 'PopulatedPlace',
                },
            },
        };
        _this.eventid = props.match.params.eventid;
        fetch("api/Event/" + _this.eventid)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState({
                event: data,
                boundary: {
                    search: data.eventLocation,
                    polygonStyle: {
                        fillColor: 'rgba(161,224,255,0.4)',
                        strokeColor: '#a495b2',
                        strokeThickness: 2,
                    },
                    option: {
                        entityType: 'PopulatedPlace',
                    },
                },
                loading: false,
            });
        });
        return _this;
    }
    EventDetails.renderEventDetails = function (_event, _boundary) {
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", { className: "text-center" }, _event.name),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Event Organisation: "),
                        _event.company)),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Date: "),
                        _event.eventdate,
                        "\u00A0-\u00A0",
                        _event.eventEndDate)),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement(EventSignUp_1.default, { event: _event }))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Microsoft Host: "),
                        React.createElement("a", { href: "mailto:" + _event.ownerEmail },
                            _event.ownerName1,
                            "\u00A0",
                            _event.ownerName2),
                        "\u00A0 (",
                        _event.department,
                        ")")),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null, "Time: "),
                        _event.startEventTime)),
                React.createElement(reactstrap_1.Col, { xs: 6, md: 4 },
                    React.createElement("p", null,
                        React.createElement("b", null,
                            React.createElement("a", { href: _event.url }, "Website"))))),
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, null, _event.description)),
            React.createElement(reactstrap_1.Row, null,
                React.createElement("div", { className: "map-large-frame" },
                    React.createElement("b", null, "Meeting Point Location:"),
                    _event.eventLocation,
                    ",\u00A0",
                    _event.country,
                    React.createElement(react_bingmaps_1.ReactBingmaps, { id: "_map", bingmapKey: Config_1.default.BING_API_KEY, boundary: _boundary, zoom: 4, className: "map-large" })))));
    };
    EventDetails.prototype.render = function () {
        var contents = this.state.loading
            ? React.createElement("p", null,
                React.createElement("em", null, "Loading..."))
            : EventDetails.renderEventDetails(this.state.event, this.state.boundary);
        return (React.createElement("div", null, contents));
    };
    return EventDetails;
}(React.Component));
exports.EventDetails = EventDetails;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, EventDetails);
//# sourceMappingURL=EventDetails.js.map