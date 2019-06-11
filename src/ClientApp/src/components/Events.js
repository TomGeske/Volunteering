import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from '../TelemetryService';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../Config'
//import Table from 'react-bootstrap/Table';
import { ReactBingmaps } from 'react-bingmaps';

export class Events extends Component {
  static renderEventsTable(_events) {
    return (
      <table className='table striped bordered hover'>
        <tbody>
          {_events.map(event => (
            <tr key={event.id}>
              <td><h3>{event.name}</h3>
                Date: {event.eventdate}   
                <a className="btn btn-primary mb1 bg-green" target="_blank" href="https://aka.ms/wwv-new-events" role="button">Register</a>
                Event Type: tbd
              </td>
              <td><b>Meeting Point Location:</b> {event.eventLocation}, {event.country}
                <div className="map-small">
                  <ReactBingmaps id={event.id} bingmapKey={config.BING_API_KEY}
                    className="map-small" />
                </div>
              </td>
              <td>
                <Link to={{
                  pathname: '/eventdetails/' + event.id
                }}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  displayName = Events.name

  constructor(props) {
    super(props);
    this.state = {
      events: [], loading: true,
      bingmapkey: "Aqa_swdrZ1-tT4mMMKHhlrYFXfVdYh8u1DxmHcVjBCAEgsUo_SpPR5aKG4roSYrz",

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
