import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from '../TelemetryService';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { ReactBingmaps } from 'react-bingmaps';
import config from '../Config';
import {
  authContext,
  adalConfig,
} from '../adalConfig';

export class Events extends Component {
  static renderEventsTable(_events, _boundary) {
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
                <ReactBingmaps
                  id={_event.id}
                  bingmapKey={config.BING_API_KEY}
                  boundary={_boundary}
                  mapOptions={{ 'showLocateMeButton': false, 'showMapTypeSelector': false }}
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
      events: [],
      boundary: {
        "search": "Switzerland",
        "polygonStyle": {
          fillColor: 'rgba(161,224,255,0.4)',
          strokeColor: '#a495b2',
          strokeThickness: 2
        },
        "option": {
          entityType: 'PopulatedPlace'
        }
      },
      loading: true,
    };

    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch('api/Event/',
      {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      }
    ).then(response => response.json())
     .then(data => {
       this.setState({
         events: data,
         boundary: {
           "search": "Switzerland",
           "polygonStyle": {
             fillColor: 'rgba(161,224,255,0.4)',
             strokeColor: '#a495b2',
             strokeThickness: 2
           },
           "option": {
             entityType: 'PopulatedPlace'
           }
          },
          loading: false
        });
      });
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Events.renderEventsTable(this.state.events, this.state.boundary);

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
