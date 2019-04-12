import ReactAI from 'react-appinsights';
import React, { Component } from 'react';

export class EventDetails extends Component {
    static renderEventDetails(_event) {
        return (
            <div>
                <h1>{_event.name}</h1>
                <dl>
                    <dt>Description</dt>
                    <dd>{_event.description}</dd>
                </dl>
                <dl>
                    <dt>Country</dt>
                    <dd>{_event.country}</dd>
                </dl>
                <dl>
                    <dt>Event Owner</dt>
                    <dd>{_event.ownerName1} {_event.ownerName2}</dd>
                </dl>
                <dl>
                    <dt>Event Owner E-Mail</dt>
                    <dd>{_event.ownerEmail}</dd>
                </dl>
                <dl>
                    <dt>Company</dt>
                    <dd>{_event.company}</dd>
                </dl>
                <dl>
                    <dt>Event date</dt>
                    <dd>{_event.eventdate}</dd>
                </dl>
                <dl>
                    <dt>Event Location</dt>
                    <dd>{_event.eventLocation}</dd>
                </dl>
                <dl>
                    <dt>Event Url</dt>
                    <dd>{_event.url}</dd>
                </dl>
                <dl>
                    <dt>Event Created</dt>
                    <dd>{_event.createdTS}</dd>
                </dl>
            </div>
        );
    }
    displayName = Event.name

    constructor(props) {
        super(props);
        this.state = { event: [], loading: true };
        this.eventid = props.match.params.eventid;
        
        fetch('api/Event/' + this.eventid)
            .then(response => response.json())
            .then(data => {
                this.setState({ event: data, loading: false });
            });
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : EventDetails.renderEventDetails(this.state.event);

        return (
            <div>
                {contents}
            </div>
        );
    }
}

export default ReactAI.withTracking(EventDetails);