import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from '../TelemetryService';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../Config'
import { Container, Row, Col, Button } from 'reactstrap';
import { ReactBingmaps } from 'react-bingmaps';

export class Events extends Component {
  static renderEventsTable(_events) {
    return (
      <Container>

        {_events.map(_event => (

          <Row>
            <Col xs={6} md={4} width="140px">
              <h3>{_event.name}</h3>
              <b>Date:</b> {new Date(_event.eventdate).toLocaleDateString()} - {new Date(_event.eventEndDate).toLocaleDateString()}
              <p>Event organizer: {_event.ownerName1} {_event.ownerName2}</p>
              <p>Event type: {_event.eventType}</p>
            </Col>
            <Col xs={6} md={4}>
              <a className="btn btn-primary mb1 bg-green" target="_blank" href="https://aka.ms/wwv-new-events" role="button">Register</a>
              <br />
              <Link to={{
                pathname: '/eventdetails/' + _event.id
              }}>Details</Link>
            </Col>
            <Col xs={6} md={4}>
              <div className="map-small">
                <ReactBingmaps id={_event.id} bingmapKey={config.BING_API_KEY} mapOptions={{ 'showLocateMeButton': false, 'showMapTypeSelector': false }}
                  className="map-small" />
              </div>
            </Col>

          </Row>
        ))}
      </Container>
    )
  }
  displayName = Events.name

  constructor(props) {
    super(props);
    this.state = {
      events: [], loading: true
    };

    fetch('api/Event/')
      .then(response => response.json())
      .then(data => {
        this.setState({ events: data, loading: false });
      });
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Events.renderEventsTable(this.state.events);

    return (
      <div>
        <h1 className="text-center">Upcoming events</h1>
        <a className="btn btn-primary btn-lg" target="_blank" href="https://aka.ms/wwv-new-events" role="button">Create event »</a>
        <br />
        {contents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, Events, "prrt");
