import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ai } from './TelemetryService';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { authContext, adalConfig } from './adalConfig';

const history = createBrowserHistory({ basename: '' });
ai.initialize({ history: history });

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

// Handle possible callbacks on id_token or access_token
authContext.handleWindowCallback()

// Extra callback logic, only in the actual application, not in iframes in the app
if ((window === window.parent) && window === window.top && !authContext.isCallback(window.location.hash)) {
  // Having both of these checks is to prevent having a token in localstorage, but no user.
  if (!authContext.getCachedToken(adalConfig.clientId) || !authContext.getCachedUser()) {
    authContext.login()
    // or render something that everyone can see
    // ReactDOM.render(<PublicPartOfApp />, document.getElementById('root'))
  } else {
    authContext.acquireToken(adalConfig.endpoints.api, (message, token, msg) => {
      if (token) {
        ReactDOM.render(
          <Router basename={baseUrl} history={history}>
            <App />
          </Router>,
          rootElement
        );
      }
    })
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

