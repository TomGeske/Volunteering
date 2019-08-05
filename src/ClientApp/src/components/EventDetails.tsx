import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { ReactBingmaps } from 'react-bingmaps';
import {
  Table,
  Row,
  Col,
} from 'reactstrap';
import { ai } from '../TelemetryService';
import config from '../Config';
import EventSignUp from './EventSignUp';
import { Event } from '../entities/Event'
import {
  authContext,
  adalConfig,
} from '../adalConfig';

interface State {
  event: Event;
  loading: boolean;
}

export class EventDetails extends React.Component<State, {}> {
  public state: State =
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
      endEventTime: 'tbd',
      url: 'tbd',
      description: 'tbd',
      mediaLink: 'tbd',
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

  private eventid: string;

  private static renderEventDetails(_event: Event): React.ReactNode {
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
              <a href={`mailto:${_event.ownerEmail}?subject=${_event.name}`}>
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
              &nbsp;-&nbsp;
              {_event.endEventTime}
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
          <Col>
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Meeting Point Location:</b>
            &nbsp;
            {_event.eventLocation}
            ,&nbsp;
            {_event.country}
            <div className="map-large-frame">
              <ReactBingmaps
                id="_map"
                bingmapKey={config.BING_API_KEY}
                boundary={_event.boundary}
                zoom={4}
                className="map-large"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>
              <b>Registered volunteers</b>
            </h4>
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
          </Col>
        </Row>
      </>
    );
  }

  private static renderRegistrationBody(_event: Event): React.ReactNode {
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
        _event.registrations.map((_registration): JSX.Element  =>
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

  private static bindBoundery(event: Event): Event {
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

  public constructor(props) {
    super(props);
    this.eventid = props.match.params.eventid;

    const token: string = authContext.getCachedToken(adalConfig.endpoints.api);

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

  public render(): React.ReactNode {
    const contents = this.state.loading
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
