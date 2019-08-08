import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Label } from 'reactstrap';
import { ReactBingmaps } from 'react-bingmaps';
import { ai } from '../TelemetryService';
import { Event } from '../entities/Event'
import config from '../Config';
import { adalApiFetch } from '../adalConfig';

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
        <Container key={_event.id}>
          <Row>
            <Col md={12}>
              <h3>
                <Link
                  aria-label={_event.name}
                  to={{ pathname: '/eventdetails/' + _event.id }}>
                  {_event.name}
                </Link>
              </h3>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <Label className="font-weight-bold">Event organizer:</Label>
                &nbsp;
                {_event.ownerName1}
                &nbsp;
                {_event.ownerName2}
              </p>
              <p>
                <Label className="font-weight-bold">Event type:</Label>
                &nbsp;
                {_event.eventType}
              </p>
              <p>
                <Label className="font-weight-bold">Date:</Label>
                &nbsp;
                {new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString()}
                &nbsp;-&nbsp;
                {new Date(Date.parse(_event.eventEndDate.toString())).toLocaleDateString()}
              </p>
            </Col>
            <Col md={6}>
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
        </Container>
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

  public componentDidMount(): void {
    document.title = "MS Volunteering: All events"
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
      ? <></>
      : Events.renderEventsTable(Events.bindPushPins(this.state.events));

    return (
      <div>
        <h2 className="text-center">{this.state.loading ? 'Loading ...' : this.state.events.length} Upcoming events</h2>
        <br />
        {contents}
        <br />
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, Events);
