import * as React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Events } from './components/Events';
import { EventDetails } from './components/EventDetails';
import { NewEvent } from './components/NewEvent';
import { MyEvents } from './components/MyEvents';

export default class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <Layout>
        <Route exact path='/' component={Events} />
        <Route name='events' path='/events' component={Events} />
        <Route name='newevent' path='/newevent' component={NewEvent} />
        <Route name='eventdetails' path='/eventdetails/:eventid' component={EventDetails} />
        <Route name='myEvents' path='/myevents' component={MyEvents} />
      </Layout>
    );
  }
}


