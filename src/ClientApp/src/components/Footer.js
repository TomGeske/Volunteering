import React, { Component } from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from '../TelemetryService';

export class Footer extends Component {
  displayName = Footer.name

  render() {
    return (
      <div>
        {/* Footer */}
        <footer className="page-footer font-small blue pt-4">
          {/* Footer Links */}
          <div className="container-fluid text-center text-md-left">
            {/* Grid row */}
            <div className="row">
              {/* Grid column */}
              <div className="col-md-6 mt-md-0 mt-3">
                {/* Content */}
                <h5 className="text-uppercase">Footer Content</h5>
                <p>Here you can use rows and columns to organize your footer content.</p>
              </div>
            </div>
            {/* Grid row */}
          </div>
          {/* Footer Links */}
          {/* Copyright */}
          <div className="footer-copyright text-center py-3">
            © 2019 Microsoft
          </div>
          {/* Copyright */}
        </footer>
        {/* Footer */}
      </div>
    );
  }
}

export default withAITracking(ai.reactPlugin, Footer);
