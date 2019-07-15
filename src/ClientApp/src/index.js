import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { runWithAdal } from 'react-adal';
import { createBrowserHistory } from 'history';
import { ai } from './TelemetryService';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { authContext } from './adalConfig';

window.Logging.log = function (message) {
  console.log(message); // this enables logging to the console
};

window.Logging.level = 2; // 0 = only error, 1 = up to warnings, 2 = up to info, 3 = up to verbose

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

registerServiceWorker();
