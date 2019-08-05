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
var reactstrap_1 = require("reactstrap");
var TelemetryService_1 = require("../TelemetryService");
var adalConfig_1 = require("../adalConfig");
var NewEvent = /** @class */ (function (_super) {
    __extends(NewEvent, _super);
    function NewEvent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            uiState: 'new',
            title: {},
            startDate: {},
            startTime: {},
            endDate: {},
            endTime: {},
            address: {},
            addressNumber: {},
            city: {},
            plz: {},
            organization: {},
            category: {},
            description: {},
            website: {},
            mediaLink: {},
            department: {},
            acknowledge1: {},
            acknowledge2: {}
        };
        _this.tryToSave = _this.tryToSave.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);
        _this.saveDataOnServer = _this.saveDataOnServer.bind(_this);
        return _this;
    }
    NewEvent.prototype.tryToSave = function (event) {
        var _this = this;
        var newState = {
            uiState: 'new'
        };
        var textFieldsToValidate = [
            'title', 'startDate', 'startTime', 'endDate', 'endTime', 'address', 'city', 'organization', 'category', 'website', 'department'
        ];
        textFieldsToValidate.forEach(function (propertyName) {
            var existingProperty = _this.state[propertyName];
            newState[propertyName] = {};
            var newProperty = newState[propertyName];
            if (existingProperty.value == null || existingProperty.value.length === 0) {
                newState.uiState = 'missing_required_field';
                newProperty.isValid = false;
            }
            else {
                newProperty.isValid = true;
                newProperty.value = existingProperty.value;
            }
        });
        var checkboxFieldsToValidate = [
            'acknowledge1', 'acknowledge2'
        ];
        checkboxFieldsToValidate.forEach(function (propertyName) {
            var existingProperty = _this.state[propertyName];
            newState[propertyName] = {};
            var newProperty = newState[propertyName];
            if (existingProperty.value !== 'true') {
                newState.uiState = 'missing_required_field';
                newProperty.isValid = false;
            }
            else {
                newProperty.isValid = true;
                newProperty.value = 'true';
            }
        });
        // check that start time is before end time
        if (newState.uiState === 'new'
            && this.state.startDate.value != null && this.state.startDate.value.length !== 0
            && this.state.startTime.value != null && this.state.startTime.value.length !== 0
            && this.state.endDate.value != null && this.state.endDate.value.length !== 0
            && this.state.endTime.value != null && this.state.endTime.value.length !== 0) {
            var startDateTime = this.getStartDateTime();
            var endDateTime = this.getEndDateTime();
            if (startDateTime >= endDateTime) {
                newState.uiState = 'date_ordering_error';
                if (this.state.startDate.value === this.state.endDate.value) {
                    this.state.endTime.isValid = false;
                }
                else {
                    this.state.endDate.isValid = false;
                }
            }
        }
        if (newState.uiState !== 'new') {
            this.setState(newState);
        }
        else {
            this.setState(newState, this.saveDataOnServer);
        }
    };
    NewEvent.prototype.getStartDateTime = function () {
        var startDate = this.state.startDate.value;
        var startTime = this.state.startTime.value;
        return new Date(startDate + 'T' + startTime);
    };
    NewEvent.prototype.getEndDateTime = function () {
        var endDate = this.state.endDate.value;
        var endTime = this.state.endTime.value;
        return new Date(endDate + 'T' + endTime);
    };
    NewEvent.prototype.saveDataOnServer = function () {
        var _this = this;
        var token = adalConfig_1.authContext.getCachedToken(adalConfig_1.adalConfig.endpoints.api);
        var startDateTime = this.getStartDateTime();
        var endDateTime = this.getEndDateTime();
        fetch("api/Event/AddEvent", {
            headers: {
                'Authorization': 'Bearer ' + token,
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: this.state.title.value,
                description: this.state.description.value,
                country: "Switzerland",
                company: this.state.organization.value,
                eventType: this.state.category.value,
                department: this.state.department.value,
                eventdate: startDateTime.toISOString(),
                eventEndDate: endDateTime.toISOString(),
                startEventTime: this.state.startTime.value,
                endEventTime: this.state.endTime.value,
                eventLocation: this.state.address.value + ' ' + this.state.addressNumber.value + ', ' + this.state.city.value + ' Switzerland',
                url: this.state.website.value,
                mediaLink: this.state.mediaLink.value,
                registrations: []
            })
        })
            .then(function (response) {
            if (response.status === 200 || response.status === 201) {
                _this.setState({ uiState: 'save_successful' });
            }
            else {
                _this.setState({ uiState: 'save_error' });
            }
        });
    };
    NewEvent.prototype.handleInputChange = function (event) {
        var target = event.target;
        var name = target.name;
        var newState = {};
        if (target.type === 'checkbox') {
            newState[name] = {
                value: target.checked ? 'true' : undefined,
                isValid: this.state[name].isValid
            };
        }
        else {
            newState[name] = {
                value: target.value,
                isValid: this.state[name].isValid
            };
        }
        this.setState(newState);
    };
    NewEvent.prototype.renderCheckBoxFormGroup = function (propertyName, label, text) {
        var property = this.state[propertyName];
        if (typeof property !== 'boolean' && typeof property !== 'string' && property != null) {
            var value = property.value;
            var isValid = property.isValid;
            return (React.createElement(reactstrap_1.FormGroup, null,
                React.createElement(reactstrap_1.Label, { for: propertyName, hidden: true },
                    label,
                    "}"),
                React.createElement(reactstrap_1.CustomInput, { type: "checkbox", id: propertyName, name: propertyName, value: value, invalid: isValid === false, onChange: this.handleInputChange, label: text })));
        }
        else {
            return (React.createElement(React.Fragment, null));
        }
    };
    NewEvent.prototype.renderTitleFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "title" }, "Title of Event:")),
                React.createElement(reactstrap_1.Col, { md: 10 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "title", id: "title", value: this.state.title.value, onChange: this.handleInputChange, invalid: this.state.title.isValid === false, placeholder: "Add a title..." })))));
    };
    NewEvent.prototype.renderStartDateFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "startDate" }, "Starting Date:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "date", name: "startDate", id: "startDate", value: this.state.startDate.value, onChange: this.handleInputChange, invalid: this.state.startDate.isValid === false })),
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "startTime" }, "Starting Time:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "time", name: "startTime", id: "startTime", value: this.state.startTime.value, onChange: this.handleInputChange, invalid: this.state.startTime.isValid === false })))));
    };
    NewEvent.prototype.renderEndDateFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "endDate" }, "Ending Date:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "date", name: "endDate", id: "endDate", value: this.state.endDate.value, onChange: this.handleInputChange, invalid: this.state.endDate.isValid === false })),
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "endTime" }, "Ending Time:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "time", name: "endTime", id: "endTime", value: this.state.endTime.value, onChange: this.handleInputChange, invalid: this.state.endTime.isValid === false })))));
    };
    NewEvent.prototype.renderAddressFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "address" }, "Address:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "address", id: "address", placeholder: "Address", value: this.state.address.value, onChange: this.handleInputChange, invalid: this.state.address.isValid === false })),
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "addressNumber" }, "Number:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "addressNumber", id: "addressNumber", value: this.state.addressNumber.value, onChange: this.handleInputChange, placeholder: "House Number" })))));
    };
    NewEvent.prototype.renderCityFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "city" }, "City:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "city", id: "city", value: this.state.city.value, onChange: this.handleInputChange, placeholder: "City", invalid: this.state.city.isValid === false })),
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "plz" }, "PLZ:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "plz", id: "plz", value: this.state.plz.value, onChange: this.handleInputChange, placeholder: "Postleitzahl" })))));
    };
    NewEvent.prototype.renderOrganizationFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "organization" }, "Volunteering Organization:")),
                React.createElement(reactstrap_1.Col, { md: 10 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "organization", id: "organization", value: this.state.organization.value, onChange: this.handleInputChange, placeholder: "Organization", invalid: this.state.organization.isValid === false })))));
    };
    NewEvent.prototype.renderCategoryFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "category" }, "Category:")),
                React.createElement(reactstrap_1.Col, { md: 10 },
                    React.createElement(reactstrap_1.Input, { type: "select", defaultValue: "none", name: "category", id: "category", value: this.state.category.value, onChange: this.handleInputChange, invalid: this.state.category.isValid === false },
                        React.createElement("option", { disabled: true, value: "none" }, " -- select an option -- "),
                        React.createElement("option", null, "Administrative/Office Work"),
                        React.createElement("option", null, "Arts (Music/Drama/Crafts)"),
                        React.createElement("option", null, "Counseling/Listening"),
                        React.createElement("option", null, "Mentoring"),
                        React.createElement("option", null, "Other / Don't Know"),
                        React.createElement("option", null, "Sports/Outdoor Activities/Coaching"),
                        React.createElement("option", null, "Teaching/Tutoring/Learning Support"),
                        React.createElement("option", null, "Youth Work"))))));
    };
    NewEvent.prototype.renderDescriptionFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "description" }, "Description:")),
                React.createElement(reactstrap_1.Col, { md: 10 },
                    React.createElement(reactstrap_1.Input, { type: "textarea", maxLength: 500, name: "description", id: "description", value: this.state.description.value, onChange: this.handleInputChange, placeholder: "Add an event description" })))));
    };
    NewEvent.prototype.renderLinksFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "website" }, "Website:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "website", id: "website", value: this.state.website.value, onChange: this.handleInputChange, placeholder: "Event website", invalid: this.state.website.isValid === false })),
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "mediaLink" }, "Media Link:")),
                React.createElement(reactstrap_1.Col, { md: 4 },
                    React.createElement(reactstrap_1.Input, { type: "text", name: "mediaLink", id: "mediaLink", value: this.state.mediaLink.value, onChange: this.handleInputChange, placeholder: "Additional media link" })))));
    };
    NewEvent.prototype.renderDepartmentFormGroup = function () {
        return (React.createElement(reactstrap_1.FormGroup, null,
            React.createElement(reactstrap_1.Row, null,
                React.createElement(reactstrap_1.Col, { md: 2, className: "label-column" },
                    React.createElement(reactstrap_1.Label, { for: "department" }, "Department:")),
                React.createElement(reactstrap_1.Col, { md: 3 },
                    React.createElement(reactstrap_1.Input, { type: "select", defaultValue: "none", name: "department", id: "department", value: this.state.department.value, onChange: this.handleInputChange, invalid: this.state.department.isValid === false },
                        React.createElement("option", { disabled: true, value: "none" }, " -- select an option -- "),
                        React.createElement("option", null, "ATU"),
                        React.createElement("option", null, "CSU"),
                        React.createElement("option", null, "Engineering"),
                        React.createElement("option", null, "M&O"),
                        React.createElement("option", null, "OCP & SMB"),
                        React.createElement("option", null, "Services"),
                        React.createElement("option", null, "STU"),
                        React.createElement("option", null, "Other / Don't Know"))))));
    };
    NewEvent.prototype.renderFormErrorMessages = function () {
        if (this.state.uiState === 'missing_required_field') {
            return (React.createElement(reactstrap_1.Alert, { color: "danger" }, "Some of the required fields are missing"));
        }
        else if (this.state.uiState === 'save_error') {
            return (React.createElement(reactstrap_1.Alert, { color: "danger" }, "An error occurred saving the data"));
        }
        else if (this.state.uiState === 'save_successful') {
            return (React.createElement(reactstrap_1.Alert, { color: "success" },
                "Your event has been saved. ",
                React.createElement("a", { href: ".", className: "alert-link" }, "Return to the event list")));
        }
        else if (this.state.uiState === 'date_ordering_error') {
            return (React.createElement(reactstrap_1.Alert, { color: "danger" }, "The event start date and time must be before the end date and time"));
        }
        else {
            return (React.createElement(React.Fragment, null));
        }
    };
    NewEvent.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("h1", { className: "text-center" }, "Create new event"),
            this.renderFormErrorMessages(),
            React.createElement(reactstrap_1.Form, null,
                React.createElement("fieldset", { disabled: this.state.uiState === 'save_successful' },
                    this.renderTitleFormGroup(),
                    this.renderStartDateFormGroup(),
                    this.renderEndDateFormGroup(),
                    this.renderAddressFormGroup(),
                    this.renderCityFormGroup(),
                    this.renderOrganizationFormGroup(),
                    this.renderCategoryFormGroup(),
                    this.renderDescriptionFormGroup(),
                    this.renderLinksFormGroup(),
                    this.renderDepartmentFormGroup(),
                    this.renderCheckBoxFormGroup('acknowledge1', 'Acknowledgement 1:', 'The volunteering event has no commercial relationship to Microsoft'),
                    this.renderCheckBoxFormGroup('acknowledge2', 'Acknowledgement 2:', 'The volunteering events\' venue is located in Switzerland'),
                    React.createElement(reactstrap_1.Button, { onClick: this.tryToSave }, "Save")))));
    };
    return NewEvent;
}(React.Component));
exports.NewEvent = NewEvent;
exports.default = applicationinsights_react_js_1.withAITracking(TelemetryService_1.ai.reactPlugin, NewEvent);
//# sourceMappingURL=NewEvent.js.map