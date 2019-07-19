import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { runWithAdal } from 'react-adal';
import { createBrowserHistory } from 'history';
import { ai } from './TelemetryService';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { authContext } from './adalConfig';

const history = createBrowserHistory({ basename: '' });
const DO_NOT_LOGIN = false;

ai.initialize({ history: history });

runWithAdal(authContext, () => {
  // eslint-disable-next-line
  require('./App.js');
}, DO_NOT_LOGIN);

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router basename={baseUrl} history={history}>
    <App />
  </Router>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

