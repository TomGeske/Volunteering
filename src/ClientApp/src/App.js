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
var react_router_1 = require("react-router");
var Layout_1 = require("./components/Layout");
var Events_1 = require("./components/Events");
var EventDetails_1 = require("./components/EventDetails");
var NewEvent_1 = require("./components/NewEvent");
var MyEvents_1 = require("./components/MyEvents");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return (React.createElement(Layout_1.Layout, null,
            React.createElement(react_router_1.Route, { exact: true, path: '/', component: Events_1.Events }),
            React.createElement(react_router_1.Route, { name: 'events', path: '/events', component: Events_1.Events }),
            React.createElement(react_router_1.Route, { name: 'newevent', path: '/newevent', component: NewEvent_1.NewEvent }),
            React.createElement(react_router_1.Route, { name: 'eventdetails', path: '/eventdetails/:eventid', component: EventDetails_1.EventDetails }),
            React.createElement(react_router_1.Route, { name: 'myEvents', path: '/myevents', component: MyEvents_1.MyEvents })));
    };
    return App;
}(React.Component));
exports.default = App;
//# sourceMappingURL=App.js.map