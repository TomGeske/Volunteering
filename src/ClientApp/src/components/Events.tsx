import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { ReactBingmaps } from 'react-bingmaps';
import { ai } from '../TelemetryService';
import { IEvent } from '../entities/IEvent'
import config from '../Config';

import {
  authContext,
  adalConfig,
} from '../adalConfig';

interface IState {
  events: IEvent[];
  loading: boolean;
}

interface IProps {

}

export class Events extends React.Component<IState, IProps> {
  state: IState =
    {
      loading: true,
      events: [],
    };

  static renderEventsTable(_events: IEvent[]) {
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
            <div className="map-small">
              <ReactBingmaps
                id={_event.id}
                bingmapKey={config.BING_API_KEY}
                boundary={_event.boundary}
                mapOptions={{ showLocateMeButton: false, showMapTypeSelector: false }}
                className="map-small" />
            </div>
          </Col>
        </Row>
      ))
    );
  }

  static bindBoundery(events: IEvent[]) {
    for (let i = 0; i < events.length; i++) {
      events[i].boundary = {
        search: events[i].eventLocation,
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
    return events;
  }

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true,
    };

    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch('api/Event/',
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
      : Events.renderEventsTable(Events.bindBoundery(this.state.events));

    return (
      <div>
        <a className="btn btn-primary btn-lg" href="./newevent" role="button">Create event »</a>
        <h2 className="text-center">Upcoming events</h2>
        <br />
        {contents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, Events);
