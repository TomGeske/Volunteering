import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Alert, Col, Row, Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { ai } from '../TelemetryService';
import { authContext, adalConfig, } from '../adalConfig';

interface IState {
  uiState: 'new' | 'missing_required_field' | 'save_error' | 'date_ordering_error' | 'save_successful';
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
    this.saveDataOnServer = this.saveDataOnServer.bind(this);
  }

  private tryToSave(event: React.MouseEvent<any, MouseEvent>): void {
    const newState = {
      uiState: 'new'
    };

    const textFieldsToValidate: (keyof IState)[] = [
      'title', 'startDate', 'startTime', 'endDate', 'endTime', 'address', 'city', 'organization', 'category', 'website', 'firstName', 'lastName', 'department'
    ];

    textFieldsToValidate.forEach((propertyName: keyof IState) => {
      const existingProperty: FormValue = this.state[propertyName] as FormValue;
      newState[propertyName] = {};
      const newProperty: FormValue = newState[propertyName];

      if (existingProperty.value == null || existingProperty.value.length === 0) {
        newState.uiState = 'missing_required_field';
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
        newState.uiState = 'missing_required_field';
        newProperty.isValid = false;
      } else {
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

      const startDateTime = this.getStartDateTime();
      const endDateTime = this.getEndDateTime();
      if (startDateTime >= endDateTime) {
        newState.uiState = 'date_ordering_error';
        if (this.state.startDate.value === this.state.endDate.value) {
          this.state.endTime.isValid = false;
        } else {
          this.state.endDate.isValid = false;
        }
      }
    }

    if (newState.uiState !== 'new') {
      this.setState(newState);
    } else {
      this.setState(newState, this.saveDataOnServer);
    }
  }

  private getStartDateTime(): Date {
    const startDate = this.state.startDate.value;
    const startTime = this.state.startTime.value;
    return new Date(startDate + 'T' + startTime);
  }

  private getEndDateTime(): Date {
    const endDate = this.state.endDate.value;
    const endTime = this.state.endTime.value;
    return new Date(endDate + 'T' + endTime);
  }

  private saveDataOnServer() {
    const token = authContext.getCachedToken(adalConfig.endpoints.api);

    const startDateTime = this.getStartDateTime();
    const endDateTime = this.getEndDateTime();

    fetch(`api/Event/AddEvent`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        name: this.state.title.value,
        description: this.state.description.value,
        country: "Switzerland",
        ownerName1: this.state.firstName.value,
        ownerName2: this.state.lastName.value,
        company: this.state.organization.value,
        eventType: this.state.category.value,
        department: this.state.department.value,
        eventdate: startDateTime.toISOString(),
        eventEndDate: endDateTime.toISOString(),
        startEventTime: this.state.startTime.value,
        eventLocation: this.state.address.value + ' ' + this.state.addressNumber.value + ', ' + this.state.city.value + ' Switzerland',
        url: this.state.website.value,
        registrations: []
      })
    })
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          this.setState({ uiState: 'save_successful' });
        } else {
          this.setState({ uiState: 'save_error' });
        }
      });
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
    if (typeof property !== 'boolean' && typeof property !== 'string' && property != null) {
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
            <Input type="date" name="endDate" id="endDate"
              value={this.state.endDate.value}
              onChange={this.handleInputChange}
              invalid={this.state.endDate.isValid === false} />
          </Col>
          <Col md={2} className="label-column">
            <Label for="endTime">Ending Time:</Label>
          </Col>
          <Col md={4}>
            <Input type="time" name="endTime" id="endTime"
              value={this.state.endTime.value}
              onChange={this.handleInputChange}
              invalid={this.state.endTime.isValid === false} />
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

  private renderFormErrorMessages() {
    if (this.state.uiState === 'missing_required_field') {
      return (
        <Alert color="danger">
          Some of the required fields are missing
        </Alert>
      );
    } else if (this.state.uiState === 'save_error') {
      return (
        <Alert color="danger">
          An error occurred saving the data
        </Alert>
      );
    } else if (this.state.uiState === 'save_successful') {
      return (
        <Alert color="success">
          Your event has been saved. <a href="." className="alert-link">Return to the event list</a>
        </Alert>
      );
    } else if (this.state.uiState === 'date_ordering_error') {
      return (
        <Alert color="danger">
          The event start date and time must be before the end date and time
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
        {this.renderFormErrorMessages()}
        <Form>
          <fieldset disabled={this.state.uiState === 'save_successful'}>
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
          </fieldset>
        </Form>
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, NewEvent);
