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
import { Button, Alert } from 'reactstrap'
import { adalApiFetch } from '../adalConfig';
import { isNullOrUndefined, isNull } from 'util';
import { Registration } from '../entities/Registration';

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
      pushpins: [],
      coordinates: {
        longitude: 46.798333,
        latitude: 8.231944,
      },
    },
  };

  private eventid: string;

  private renderEventDetails(_event: Event): React.ReactNode {
    return (
      <>
        <h1 className="text-center">{_event.name}</h1>
        <Row>
          <Col xs={6} md={4}>
            <p>
              <b>Event Organisation: </b>
              <a href={_event.url} title={_event.company}>{_event.company}</a>
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
            <EventSignUp event={_event} onRegister={this.refreshAttendeeList} />
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
                {this.renderMediaLink(_event.mediaLink)}
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
              {_event.coordinates !== null ?
                <ReactBingmaps
                  id="_map"
                  bingmapKey={config.BING_API_KEY}
                  center={[_event.coordinates.latitude, _event.coordinates.longitude]}
                  pushPins={_event.pushpins}
                  zoom={9}
                  className="map-large"
                />
                :
                <Alert color="warning">
                  Map is not available. Location coordinates not found.
                </Alert>
              }
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
                {this.renderRegistrationBody(_event)}
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    );
  }

  //TODO
  private refreshAttendeeList(reg: Registration): void {
    this.setState({
      loading: false
    });
  }

  private renderRegistrationBody(_event: Event): React.ReactNode {
    if (_event.registrations === null || _event.registrations.length == 0) {
      return (
        <tr className="justify-content-md-center">
          <td colSpan={2} >
            <p>
              No registrations yet. Be the first.
            </p>
          </td>
        </tr>
      );
    }
    else {
      return (
        _event.registrations.map((_registration): JSX.Element =>
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

  private renderMediaLink(mediaLink: string): JSX.Element {
    if (mediaLink !== null && mediaLink !== '') {
      return (
        <a href={mediaLink} target="_blank">Media Link</a>
      );
    }
    else {
      return (<></>);
    }
  }

  private bindPushPin(event: Event): Event {
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
  }

  public constructor(props) {
    super(props);

    this.eventid = props.match.params.eventid;
    this.refreshAttendeeList = this.refreshAttendeeList.bind(this);

    adalApiFetch(`api/Event/${this.eventid}`)
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
      : this.renderEventDetails(this.bindPushPin(this.state.event));

    return (
      <div>
        {contents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, EventDetails);
