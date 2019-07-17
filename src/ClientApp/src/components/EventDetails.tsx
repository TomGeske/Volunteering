import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { ReactBingmaps } from 'react-bingmaps';
import {
  Container,
  Table,
  Row,
  Col,
} from 'reactstrap';
import { ai } from '../TelemetryService';
import config from '../Config';
import EventSignUp from './EventSignUp';
import { IEvent } from '../entities/IEvent'
import {
  authContext,
  adalConfig,
} from '../adalConfig';

interface IState {
  event: IEvent;
  loading: boolean;
}

interface IProps {

}

export class EventDetails extends React.Component<IState, IProps> {
  state: IState =
    {
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
        url: 'tbd',
        description: 'tbd',
        registrations: [],
        eventType: 'tbd',
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
        }
      },
    };

  eventid: string;

  static renderEventDetails(_event: IEvent) {
    return (
      <>
        <h1 className="text-center">{_event.name}</h1>
        <Row>
          <Col xs={6} md={4}>
            <p>
              <b>Event Organisation: </b>
              {_event.company}
            </p>
          </Col>
          <Col xs={6} md={4}>
            <p>
              <b>Date: </b>
              {new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString()}
              &nbsp;-&nbsp;
              {new Date(Date.parse(_event.eventEndDate.toString())).toLocaleDateString()}
            </p>
          </Col>
          <Col xs={6} md={4}>
            <EventSignUp event={_event} />
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={4}>
            <p>
              <b>Microsoft Host: </b>
              <a href={`mailto:${_event.ownerEmail}`}>
                {_event.ownerName1}
                &nbsp;
                {_event.ownerName2}
              </a>
              &nbsp;
              (
              {_event.department}
              )
            </p>
          </Col>
          <Col xs={6} md={4}>
            <p>
              <b>Time: </b>
              {_event.startEventTime}
            </p>
          </Col>
          <Col xs={6} md={4}>
            <p>
              <b>
                <a href={_event.url}>Website</a>
              </b>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {_event.description}
          </Col>
        </Row>
        <Row>
          <div className="map-large-frame">
            <b>Meeting Point Location:</b>
            {_event.eventLocation}
            ,&nbsp;
            {_event.country}
            <ReactBingmaps
              id="_map"
              bingmapKey={config.BING_API_KEY}
              boundary={_event.boundary}
              zoom={4}
              className="map-large"
            />
          </div>
        </Row>
        <Row>
          <h4>
            <b>Registered volunteers</b>
          </h4>
          <Container>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Registration</th>
                </tr>
              </thead>
              <tbody>
                {EventDetails.renderRegistrationBody(_event)}
              </tbody>
            </Table>
          </Container>
        </Row>
      </>
    );
  }

  private static renderRegistrationBody(_event: IEvent) {
    if (_event.registrations == null) {
      return (
        <tr className="justify-content-md-center">
          <td colSpan={2} >
            <p>
              No registrations yet
            </p>
          </td>
        </tr>
      );
    }
    else {
      return (
        _event.registrations.map(_registration =>
          <tr key={_registration.userId} className="justify-content-md-center">
            <td >
              <p>
                <a href={`mailto:${_registration.userId}`}>
                  {_registration.name1}
                  &nbsp;
                  {_registration.name2}
                </a>
              </p>
            </td>
            <td>
              <p>{new Date(Date.parse(_registration.createdTS.toString())).toLocaleDateString()}</p>
            </td>
          </tr>
        ));
    }
  }

  static bindBoundery(event: IEvent) {
    if (event.eventLocation && event.eventLocation.length > 0) {
      event.boundary = {
        search: event.eventLocation,
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
    return event;
  }

  constructor(props) {
    super(props);
    this.eventid = props.match.params.eventid;

    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch(`api/Event/${this.eventid}`,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          event: data,
          loading: false,
        });
      });
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : EventDetails.renderEventDetails(EventDetails.bindBoundery(this.state.event));

    return (
      <div>
        {contents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, EventDetails);
