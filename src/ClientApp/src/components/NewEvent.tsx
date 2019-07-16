﻿import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Alert, Col, Row, Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { ai } from '../TelemetryService';

interface IState {
  formContainsErrors: boolean;
  title: FormValue;
  startDate: FormValue;
  startTime: FormValue;
  endDate: FormValue;
  endTime: FormValue;
  address: FormValue;
  addressNumber: FormValue;
  city: FormValue;
  plz: FormValue;
  organization: FormValue;
  category: FormValue;
  description: FormValue;
  website: FormValue;
  mediaLink: FormValue;
  firstName: FormValue;
  lastName: FormValue;
  department: FormValue;
  acknowledge1: FormValue;
  acknowledge2: FormValue;
}

interface FormValue {
  value?: string;
  isValid?: boolean;
}

interface IProps {
}


export class NewEvent extends React.Component<IState, IProps> {
  state: IState = {
    formContainsErrors: false,
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
    firstName: {},
    lastName: {},
    department: {},
    acknowledge1: {},
    acknowledge2: {}
  };

  constructor(props) {
    super(props);
    this.tryToSave = this.tryToSave.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  private tryToSave(event: React.MouseEvent<any, MouseEvent>): void {
    const newState = {
      formContainsErrors: false
    };

    const textFieldsToValidate: (keyof IState)[] = [
      'title', 'startDate', 'startTime', 'address', 'city', 'organization', 'category', 'website', 'firstName', 'lastName', 'department'
    ];

    textFieldsToValidate.forEach((propertyName: keyof IState) => {
      const existingProperty: FormValue = this.state[propertyName] as FormValue;
      newState[propertyName] = {};
      const newProperty: FormValue = newState[propertyName];

      if (existingProperty.value == null || existingProperty.value.length === 0) {
        newState.formContainsErrors = true;
        newProperty.isValid = false;
      } else {
        newProperty.isValid = true;
        newProperty.value = existingProperty.value;
      }
    });

    const checkboxFieldsToValidate: (keyof IState)[] = [
      'acknowledge1', 'acknowledge2'
    ];
    
    checkboxFieldsToValidate.forEach((propertyName: keyof IState) => {
      const existingProperty: FormValue = this.state[propertyName] as FormValue;
      newState[propertyName] = {};
      const newProperty: FormValue = newState[propertyName];

      if (existingProperty.value !== 'true') {
        newState.formContainsErrors = true;
        newProperty.isValid = false;
      } else {
        newProperty.isValid = true;
        newProperty.value = 'true';
      }
    });


    this.setState(newState);
  }

  private handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const newState = {};
    if (target.type === 'checkbox') {
      newState[name] = {
        value: target.checked ? 'true' : undefined,
        isValid: this.state[name].isValid
      };
    } else {
      newState[name] = {
        value: target.value,
        isValid: this.state[name].isValid
      };
    }

    this.setState(newState);
  }

  private renderCheckBoxFormGroup(propertyName: keyof IState, label: string, text: string): JSX.Element | null {
    const property = this.state[propertyName];
    if (typeof property !== 'boolean') {
      const value = property.value;
      const isValid = property.isValid;
      return (
        <FormGroup>
          <Label for={propertyName} hidden>{label}}</Label>
          <CustomInput type="checkbox"
            id={propertyName}
            name={propertyName}
            value={value}
            invalid={isValid === false}
            onChange={this.handleInputChange}
            label={text} />
        </FormGroup>

      );
    } else {
      return null;
    }
  }

  private renderTitleFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column"><Label for="title">Title of Event:</Label></Col>
          <Col md={10}>
            <Input type="text" name="title" id="title"
              value={this.state.title.value}
              onChange={this.handleInputChange}
              invalid={this.state.title.isValid === false}
              placeholder="Add a title..." />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderStartDateFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="startDate">Starting Date:</Label>
          </Col>
          <Col md={4}>
            <Input type="date" name="startDate" id="startDate"
              value={this.state.startDate.value}
              onChange={this.handleInputChange}
              invalid={this.state.startDate.isValid === false} />
          </Col>
          <Col md={2} className="label-column">
            <Label for="startTime">Starting Time:</Label>
          </Col>
          <Col md={4}>
            <Input type="time" name="startTime" id="startTime"
              value={this.state.startTime.value}
              onChange={this.handleInputChange}
              invalid={this.state.startTime.isValid === false} />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderEndDateFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="endDate">Ending Date:</Label>
          </Col>
          <Col md={4}>
            <Input type="date" name="endDate" id="endDate" value={this.state.endDate.value} onChange={this.handleInputChange} />
          </Col>
          <Col md={2} className="label-column">
            <Label for="endTime">Ending Time:</Label>
          </Col>
          <Col md={4}>
            <Input type="time" name="endTime" id="endTime" value={this.state.endTime.value} onChange={this.handleInputChange} />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderAddressFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="address">Address:</Label>
          </Col>
          <Col md={4}>
            <Input type="text" name="address" id="address"
              placeholder="Address"
              value={this.state.address.value}
              onChange={this.handleInputChange}
              invalid={this.state.address.isValid === false} />
          </Col>
          <Col md={2} className="label-column">
            <Label for="addressNumber">Number:</Label>
          </Col>
          <Col md={4}>
            <Input type="text" name="addressNumber" id="addressNumber" value={this.state.addressNumber.value} onChange={this.handleInputChange} placeholder="House Number" />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderCityFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="city">City:</Label>
          </Col>
          <Col md={4}>
            <Input type="text" name="city" id="city"
              value={this.state.city.value}
              onChange={this.handleInputChange}
              placeholder="City"
              invalid={this.state.city.isValid === false}
            />
          </Col>
          <Col md={2} className="label-column">
            <Label for="plz">PLZ:</Label>
          </Col>
          <Col md={4}>
            <Input type="text" name="plz" id="plz" value={this.state.plz.value} onChange={this.handleInputChange} placeholder="Postleitzahl" />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderOrganizationFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="organization">Volunteering Organization:</Label>
          </Col>
          <Col md={10}>
            <Input type="text" name="organization" id="organization"
              value={this.state.organization.value}
              onChange={this.handleInputChange}
              placeholder="Organization"
              invalid={this.state.organization.isValid === false} />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderCategoryFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="category">Category:</Label>
          </Col>
          <Col md={10}>
            <Input type="select" defaultValue="none" name="category" id="category"
              value={this.state.category.value}
              onChange={this.handleInputChange}
              invalid={this.state.category.isValid === false}>
              <option disabled value="none"> -- select an option -- </option>
              <option>Administrative/Office Work</option>
              <option>Arts (Music/Drama/Crafts)</option>
              <option>Counseling/Listening</option>
              <option>Mentoring</option>
              <option>Other / Don't Know</option>
              <option>Sports/Outdoor Activities/Coaching</option>
              <option>Teaching/Tutoring/Learning Support</option>
              <option>Youth Work</option>
            </Input>
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderDescriptionFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="description">Description:</Label>
          </Col>
          <Col md={10}>
            <Input type="textarea" maxLength={500} name="description" id="description" value={this.state.description.value} onChange={this.handleInputChange} placeholder="Add an event description" />
          </Col>
        </Row>
      </FormGroup>);
  }

  private renderLinksFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="website">Website:</Label>
          </Col>
          <Col md={4}>
            <Input type="text" name="website" id="website"
              value={this.state.website.value}
              onChange={this.handleInputChange}
              placeholder="Event website"
              invalid={this.state.website.isValid === false} />
          </Col>
          <Col md={2} className="label-column">
            <Label for="mediaLink">Media Link:</Label>
          </Col>
          <Col md={4}>
            <Input type="text" name="mediaLink" id="mediaLink" value={this.state.mediaLink.value} onChange={this.handleInputChange} placeholder="Additional media link" />
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderNamesFormGroup(): JSX.Element {
    return (
      <FormGroup>
        <Row>
          <Col md={2} className="label-column">
            <Label for="firstName">First Name:</Label>
          </Col>
          <Col md={2}>
            <Input type="text" name="firstName" id="firstName"
              value={this.state.firstName.value}
              onChange={this.handleInputChange}
              placeholder="First name"
              invalid={this.state.firstName.isValid === false} />
          </Col>
          <Col md={2} className="label-column">
            <Label for="lastName">Last Name:</Label>
          </Col>
          <Col md={2}>
            <Input type="text" name="lastName" id="lastName"
              value={this.state.lastName.value}
              onChange={this.handleInputChange}
              placeholder="Last name"
              invalid={this.state.lastName.isValid === false} />
          </Col>
          <Col md={1} className="label-column">
            <Label for="department">Department:</Label>
          </Col>
          <Col md={3}>
            <Input type="select" defaultValue="none" name="department" id="department"
              value={this.state.department.value}
              onChange={this.handleInputChange}
              invalid={this.state.department.isValid === false}>
              <option disabled value="none"> -- select an option -- </option>
              <option>ATU</option>
              <option>STU</option>
              <option>CSU</option>
              <option>OCP &amp; SMB</option>
              <option>M&amp;O</option>
              <option>Other / Don't Know</option>
            </Input>
          </Col>
        </Row>
      </FormGroup>
    );
  }

  private renderFormErrorMessage() {
    if (this.state.formContainsErrors === true) {
      return (
        <Alert color="danger">
          Some of the required fields are missing
        </Alert>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <h1 className="text-center">Create new event</h1>
        {this.renderFormErrorMessage()}
        <Form>
          {this.renderTitleFormGroup()}
          {this.renderStartDateFormGroup()}
          {this.renderEndDateFormGroup()}
          {this.renderAddressFormGroup()}
          {this.renderCityFormGroup()}
          {this.renderOrganizationFormGroup()}
          {this.renderCategoryFormGroup()}
          {this.renderDescriptionFormGroup()}
          {this.renderLinksFormGroup()}
          {this.renderNamesFormGroup()}
          {this.renderCheckBoxFormGroup('acknowledge1', 'Acknowledgement 1:', 'The volunteering event has no commercial relationship to Microsoft')}
          {this.renderCheckBoxFormGroup('acknowledge2', 'Acknowledgement 2:', 'The volunteering events\' venue is located in Switzerland')}
          <Button onClick={this.tryToSave}>Save</Button>
        </Form>
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, NewEvent);
