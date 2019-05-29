import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from '../TelemetryService';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import Table from 'react-bootstrap/Table';

export class Events extends Component {
    static renderEventsTable(_events) {
        return (
            <table className='table' striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {_events.map(event => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>{event.eventdate}</td>
                                <td>{event.eventLocation}</td>
                                <td>
                                    <Link to={{
                                        pathname: '/eventdetails/' + event.id
                                  }}>Details</Link>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        );
    }
    displayName = Events.name

    constructor(props) {
        super(props);
        this.state = { events: [], loading: true };

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
                <h1>Events</h1>
                <p>All upcoming events.</p>
                {contents}
            </div>
        );
    }
}

export default withAITracking(ai.reactPlugin, Events, "prrt");
