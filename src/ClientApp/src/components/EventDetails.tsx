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
import {
  authContext,
  adalConfig,
} from '../adalConfig';

interface IState {
  event: IEvent;
  loading: boolean;
  boundary: IBoundary;
}

interface IProps {

}

interface IEvent {
  id: string;
  name: string;
  company: string;
  ownerName1: string;
  ownerName2: string;
  ownerEmail: string;
  department: string;
  country: string;
  eventLocation: string;
  eventdate: Date;
  eventEndDate: Date;
  startEventTime: string;
  url: string;
  description: string;
  registrations: IRegistrations[];
}

interface IRegistrations {
  userId: string;
  createdTS: Date;
}

interface IBoundary {
  search: string;
  polygonStyle: any;
  option: any;
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

  eventid: string;

  static renderEventDetails(_event: IEvent, _boundary: IBoundary) {
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
              {_event.eventdate}
              &nbsp;-&nbsp;
              {_event.eventEndDate}
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
              boundary={_boundary}
              zoom={4}
              className="map-large"
            />
          </div>
         </Row>
         <Row>
            <Col xs={6} md={4}>
                <b>Volunteers</b>
            </Col>
         </Row>
         <Row>
            <Container>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Time Of Registration</th>
                        </tr>
                    </thead>
                    <tbody>
                    {_event.registrations.map(_registration =>
                        <tr key={_registration.userId} className="justify-content-md-center">
                            <td >
                                <p>{_registration.userId}</p>
                            </td>
                            <td>
                                <p>{_registration.createdTS}</p>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </Table>            
          </Container>
        </Row>
      </>
    );
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
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : EventDetails.renderEventDetails(this.state.event, this.state.boundary);

    return (
      <div>
        {contents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, EventDetails);
