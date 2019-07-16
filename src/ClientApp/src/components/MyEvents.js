import { withAITracking } from '@microsoft/applicationinsights-react-js';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { ai } from '../TelemetryService';
import {
  authContext,
  adalConfig,
} from '../adalConfig';

export class MyEvents extends Component {
  static renderEventsTable(_events) {
    return (
      <Container>
        {_events.map(_event => (

          <Row key={_event.id} className="justify-content-md-center">
            <Col sm>
              <h3>{_event.name}</h3>
              <p>
                <b>Event organizer:</b> {_event.ownerName1} {_event.ownerName2}
              </p>
              <p>
                <b>Event type:</b> {_event.eventType}
              </p>
            </Col>
            <Col sm>
              <Link className="btn btn-primary mb1 bg-green" to={{
                pathname: '/eventdetails/' + _event.id
              }}>Details</Link>
              <br />
              <b>Date:</b> {new Date(_event.eventdate).toLocaleDateString()} - {new Date(_event.eventEndDate).toLocaleDateString()}
            </Col>
            <Col>
              <div className="map-small">
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    )
  }

  displayName = MyEvents.name

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true,
    };

    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch('api/Event/GetUserRegisteredEvents/',
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(response => response.json())
      .then(data => {
        this.setState({
          events: data,
          loading: false,
        });
      });
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : MyEvents.renderEventsTable(this.state.events, this.state.boundary);

    return (
      <div>
        <h1 className="text-center">Events I registered for</h1>
        <br />
        {contents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, MyEvents);
