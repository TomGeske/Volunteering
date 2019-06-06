import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Events } from './components/Events';
import { EventDetails } from './components/EventDetails';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Events} />
        <Route name='events' path='/events' component={Events} />
        <Route name='eventdetails' path='/eventdetails/:eventid' component={EventDetails} />
      </Layout>
    );
  }
}
