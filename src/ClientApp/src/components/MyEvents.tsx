import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Table } from 'reactstrap';
import { ai } from '../TelemetryService';
import { adalApiFetch } from '../adalConfig';
import { Event } from '../entities/Event';

interface State {
  registeredEvents: Event[];
  ownedEvents: Event[];
  loadingOwned: boolean;
  loadingRegistered: boolean;
}

enum EventType {
  Registered,
  Owned
}

export class MyEvents extends React.Component<State, {}> {
  public state: State =
  {
    registeredEvents: [],
    ownedEvents: [],
    loadingOwned: false,
    loadingRegistered: false,
  };

  private static renderEventButton(type: EventType, id: string): React.ReactNode {
    if (type === EventType.Registered) {
      return (
        <Link className="btn btn-primary mb3 bg-green" to={{
          pathname: '/eventdetails/' + id
        }}>Details</Link>
      );
    } else {
      return (
        <Link className="btn btn-primary mb3 bg-green" to={{
          pathname: '/editevent/' + id
        }}>EditEvent</Link>
      );
    }
  }

  private static renderEventsTable(_events: Event[], type: EventType): React.ReactNode {
    return (
      <Container>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th># Volunteers</th>
              <th> Registration Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {_events.map((_event): JSX.Element  => (
              <tr key={_event.id} className="justify-content-md-center">
                <td >
                  <p>{_event.name}</p>
                </td>
                <td>
                  <p>{_event.company}</p>
                </td>
                <td>
                  <p>{_event.registrations == null ? 0 : _event.registrations.length}</p>
                </td>
                <td>
                  <p>{new Date(Date.parse(_event.eventdate.toString())).toLocaleDateString()}</p>
                </td>
                <td align="right">
                  {this.renderEventButton(type, _event.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    )
  }

  public constructor(props) {
    super(props);
    this.state = {
      registeredEvents: [],
      ownedEvents: [],
      loadingRegistered: true,
      loadingOwned: true
    };

    adalApiFetch(`api/Event/GetUserRegisteredEvents/`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          registeredEvents: data,
          loadingRegistered: false,
        });
      });

    adalApiFetch(`api/Event/GetUserOwnedEvents/`)    
      .then(response => response.json())
      .then(data => {
        this.setState({
          ownedEvents: data,
          loadingOwned: false,
        });
      });
  }

  public render(): React.ReactNode {
    const registeredEvents = this.state.loadingRegistered
      ? <p><em>Loading...</em></p>
      : MyEvents.renderEventsTable(this.state.registeredEvents, EventType.Registered);

    const ownedEvents = this.state.loadingOwned
      ? <p><em>Loading...</em></p>
      : MyEvents.renderEventsTable(this.state.ownedEvents, EventType.Owned);

    return (
      <div>
        <h1 className="text-left">Events I registered for</h1>
        <br />
        {registeredEvents}
        <h1 className="text-left">Events I own</h1>
        <br />
        {ownedEvents}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, MyEvents);
