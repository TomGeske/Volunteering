import React, { Component } from 'react';

export class FetchEvents extends Component {
    static renderEventsTable(_events) {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Owner</th>
                    </tr>
                </thead>
                <tbody>
                    {_events.map(event =>
                        <tr key={event.id}>
                            <td>{event.name}</td>
                            <td>{event.eventdate}</td>
                            <td>{event.eventLocation}</td>
                            <td>{event.ownerName1}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    displayName = FetchEvents.name

    constructor(props) {
        super(props);
        this.state = { events: [], loading: true };

        fetch('api/Event/GetEvents')
            .then(response => response.json())
            .then(data => {
                this.setState({ events: data, loading: false });
            });
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchEvents.renderEventsTable(this.state.events);

        return (
            <div>
                <h1>Events</h1>
                <p>All upcoming events.</p>
                {contents}
            </div>
        );
    }
}
