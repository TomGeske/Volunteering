import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText, CustomInput } from 'reactstrap';
import { ai } from '../TelemetryService';
import config from '../Config';
import EventSignUp from './EventSignUp';

interface IState {
}

interface IProps {
}


export class NewEvent extends React.Component<IState, IProps> {
  state: IState =
    {
    };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1 className="text-center">Create new event</h1>
        <Form>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column"><Label for="title">Title of Event:</Label></Col>
              <Col md={10}><Input type="text" name="title" id="title" placeholder="Add a title..." /></Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="startDate">Starting Date:</Label>
              </Col>
              <Col md={4}>
                <Input type="date" name="startDate" id="startDate" />
              </Col>
              <Col md={2} className="label-column">
                <Label for="startTime">Starting Time:</Label>
              </Col>
              <Col md={4}>
                <Input type="time" name="startTime" id="startTime" />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="endDate">Ending Date:</Label>
              </Col>
              <Col md={4}>
                <Input type="date" name="endDate" id="endDate" />
              </Col>
              <Col md={2} className="label-column">
                <Label for="endTime">Ending Time:</Label>
              </Col>
              <Col md={4}>
                <Input type="time" name="endTime" id="endTime" />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="address">Address:</Label>
              </Col>
              <Col md={4}>
                <Input type="text" name="address" id="address" placeholder="Address" />
              </Col>
              <Col md={2} className="label-column">
                <Label for="addressNumber">Number:</Label>
              </Col>
              <Col md={4}>
                <Input type="text" name="addressNumber" id="addressNumber" placeholder="House Number" />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="city">City:</Label>
              </Col>
              <Col md={4}>
                <Input type="text" name="city" id="city" placeholder="Postleitzahl" />
              </Col>
              <Col md={2} className="label-column">
                <Label for="plz">PLZ:</Label>
              </Col>
              <Col md={4}>
                <Input type="text" name="plz" id="plz" placeholder=".." />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="organization">Volunteering Organization:</Label>
              </Col>
              <Col md={10}>
                <Input type="text" name="organization" id="organization" placeholder="Organization" />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="category">Category:</Label>
              </Col>
              <Col md={10}>
                <Input type="select" name="category" id="category" >
                  <option disabled selected value="none"> -- select an option -- </option>
                  <option>Administrative/Office Work</option>
                  <option>Arts (Music/Drama/Crafts)</option>
                  <option>Counseling/Listening</option>
                  <option>Mentoring</option>
                  <option>Sports/Outdoor Activities/Coaching</option>
                  <option>Teaching/Tutoring/Learning Support</option>
                  <option>Youth Work</option>
                </Input>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="description">Description:</Label>
              </Col>
              <Col md={10}>
                <Input type="textarea" maxLength={500} name="description" id="description" placeholder="Add an event description" />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="website">Website:</Label>
              </Col>
              <Col md={4}>
                <Input type="text" name="website" id="website" placeholder="Event website" />
              </Col>
              <Col md={2} className="label-column">
                <Label for="mediaLink">Media Link:</Label>
              </Col>
              <Col md={4}>
                <Input type="text" name="mediaLink" id="mediaLink" placeholder="Additional media link" />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={2} className="label-column">
                <Label for="firstName">First Name:</Label>
              </Col>
              <Col md={2}>
                <Input type="text" name="firstName" id="firstName" placeholder="First name" />
              </Col>
              <Col md={2} className="label-column">
                <Label for="lastName">Last Name:</Label>
              </Col>
              <Col md={2}>
                <Input type="text" name="lastName" id="lastName" placeholder="Last name" />
              </Col>
              <Col md={1} className="label-column">
                <Label for="department">Department:</Label>
              </Col>
              <Col md={3}>
                <Input type="select" name="department" id="department" >
                  <option disabled selected value="none"> -- select an option -- </option>
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
          <FormGroup>
            <Label for="acknowledgement1" hidden>Acknowledgement 1:</Label>
            <CustomInput type="checkbox" id="acknowledgement1" label="The volunteering event has no commercial relationship to Microsoft" />
          </FormGroup>
          <FormGroup>
            <Label for="acknowledgement2" hidden>Acknowledgement 2:</Label>
            <CustomInput type="checkbox" id="acknowledgement2" label="The volunteering events' venue is located in Switzerland" />
          </FormGroup>
          <Button>Save</Button>
        </Form>
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, NewEvent);
