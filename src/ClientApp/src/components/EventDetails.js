import { withAITracking } from '@microsoft/applicationinsights-react-js';
import React, { Component } from 'react';
import { ReactBingmaps } from 'react-bingmaps';
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { ai } from '../TelemetryService';
import config from '../Config';

export class EventDetails extends Component {
  static renderEventDetails(_event, _boundary) {
    return (
      <Container>
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
              {new Date(_event.eventdate).toLocaleDateString()}
              &nbsp;-&nbsp;
              {new Date(_event.eventEndDate).toLocaleDateString()}
            </p>
          </Col>
          <Col xs={6} md={4}>
            <Button disabled>Register</Button>
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
      </Container>
    );
  }

  displayName = Event.name

  constructor(props) {
    super(props);
    this.state = {
      event: [],
      loading: true,
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

    this.eventid = props.match.params.eventid;

    fetch(`api/Event/${this.eventid}`)
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
