import { withAITracking } from '@microsoft/applicationinsights-react-js';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Table } from 'reactstrap';
import { ai } from '../TelemetryService';
import {
  authContext,
  adalConfig,
} from '../adalConfig';
import { IEvent } from '../entities/IEvent';

interface IState {
  registeredEvents: IEvent[];
  ownedEvents: IEvent[];
  loadingOwned: boolean;
  loadingRegistered: boolean;
}

interface IProps {

}

export class MyEvents extends React.Component<IState, IProps> {
  state: IState =
  {
    registeredEvents: [],
    ownedEvents: [],
    loadingOwned: false,
    loadingRegistered: false,
  };
  static renderEventButton(type, id) {
    if(type === 'registered') {
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
  static renderEventsTable(_events, type) {
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
              {_events.map(_event => (
                 <tr key={_event.id} className="justify-content-md-center">
                   <td >
                     <p>{_event.name}</p>
                   </td>
                   <td>
                     <p>{_event.company}</p>
                   </td>
                   <td>
                     <p>{_event.registrations==null? 0 : _event.registrations.length}</p>
                   </td>
                   <td>
                     <p>{new Date(_event.eventdate).toLocaleDateString()}</p>
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

   constructor(props) {
    super(props);
    this.state = {
      registeredEvents: [],
      ownedEvents: [],
      loadingRegistered: true,
      loadingOwned: true
    };

    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch(`api/Event/GetUserRegisteredEvents/`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(response => response.json())
      .then(data => {
        this.setState({
          registeredEvents: data,
          loadingRegistered: false,
        });
      });

    fetch(`api/Event/GetUserOwnedEvents/`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(response => response.json())
      .then(data => {
        this.setState({
          ownedEvents: data,
          loadingOwned: false,
        });
      });
  }


  render() {
    let registeredEvents = this.state.loadingRegistered
      ? <p><em>Loading...</em></p>
      : MyEvents.renderEventsTable(this.state.registeredEvents,"registered" );

    let ownedEvents = this.state.loadingOwned
      ? <p><em>Loading...</em></p>
      : MyEvents.renderEventsTable(this.state.ownedEvents,"owned");

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
