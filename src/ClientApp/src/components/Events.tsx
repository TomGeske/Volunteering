import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { ReactBingmaps } from 'react-bingmaps';
import { ai } from '../TelemetryService';
import { Event } from '../entities/Event'
import config from '../Config';

import {
  authContext,
  adalConfig,
  adalApiFetch,
} from '../adalConfig';

interface State {
  events: Event[];
  loading: boolean;
}

export class Events extends React.Component<State, {}> {
  public state: State =
  {
    loading: true,
    events: [],
  };

  private static renderEventsTable(_events: Event[]): React.ReactNode {
    return (
      _events.map(_event => (
        <Row key={_event.id} className="justify-content-md-center">
          <Col sm>
            <h3>{_event.name}</h3>
            <p>
              <b>Event organizer:</b>
              &nbsp;
              {_event.ownerName1}
              &nbsp;
              {_event.ownerName2}
            </p>
            <p>
              <b>Event type:</b>
              &nbsp;
              {_event.eventType}
            </p>
          </Col>
          <Col sm>
            <Link
              className="btn btn-primary mb1 bg-green"
              aria-label={_event.name}
              to={{ pathname: '/eventdetails/' + _event.id }}>
              Details
            </Link>
            <br />
            <b>Date:</b>
            &nbsp;
            {new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString()}
            &nbsp;-&nbsp;
            {new Date(Date.parse(_event.eventEndDate.toString())).toLocaleDateString()}
          </Col>
          <Col>
            <div className="map-small" aria-label={_event.eventLocation}>
              <ReactBingmaps
                id={_event.id}
                bingmapKey={config.BING_API_KEY}
                center={[_event.coordinates.latitude, _event.coordinates.longitude]}
                pushPins={_event.pushpins}
                zoom={9}
                mapOptions={{ showLocateMeButton: false, showMapTypeSelector: false }}
                className="map-small" />
            </div>
          </Col>
        </Row>
      ))
    );
  }

  private static bindPushPins(events: Event[]): Event[] {
    for (let i = 0; i < events.length; i++) {
      const event: Event = events[i];
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
    }
    return events;
  }

  public constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true,
    };

    adalApiFetch('api/Event/')
      .then(response => response.json())
      .then(data => {
        this.setState({
          events: data,
          loading: false,
        });
      });
  }

  public render(): React.ReactNode {
    const contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Events.renderEventsTable(Events.bindPushPins(this.state.events));

    return (
      <div>
        <a className="btn btn-primary btn-lg" href="./newevent" role="button">Create event »</a>
        <h2 className="text-center">Upcoming events</h2>
        <br />
        {contents}
        <br />
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, Events);
