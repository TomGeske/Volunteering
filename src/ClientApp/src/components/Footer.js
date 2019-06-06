import React, { Component } from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from '../TelemetryService';

export class Footer extends Component {
  displayName = Footer.name

  render() {
    return (
      <div>
        {/* Footer */}
        <footer className="footer font-small mt-auto pt-4">
          {/* Footer Links */}
          <div className="container-fluid text-center text-md-left">
            {/* Grid row */}
            <div className="row">
              {/* Grid column */}
              <div className="col-md-6 mt-md-0 mt-3">
                {/* Content */}
                <h5 className="text-uppercase">Do you have feedback? </h5>
                <p>Please let us know <a href="https://github.com/TomGeske/Volunteering/issues">here</a></p>
                {/* Content */}
              </div>
              {/* Grid column */}
              <hr class="clearfix w-100 d-md-none pb-3" />
              {/* Grid column */}
              <div class="col-md-3 mb-md-0 mb-3">
              </div>
              {/* Grid column */}

              {/* Grid column */}
              <div class="col-md-3 mb-md-0 mb-3">
                <span class="text-muted">
                  Microsoft confidential. For use only by Microsof​t employees and approved vendors working on​​​behalf of​​ Microsoft.<a href="https://microsoft.sharepoint.com/teams/msdpn/sitepages/default.aspx">Data protection notice​​.</a>
                </span>
              </div>
                  {/* Grid column */}
            </div>
                {/* Grid row */}
              </div>
              {/* Footer Links */}
              {/* Copyright */}
              <div className="footer-copyright text-center py-3">
                &copy; Microsoft {new Date().getFullYear()}
              </div>
              {/* Copyright */}
        </footer>
            {/* Footer */}
          </div>
          );
        }
      }
      
      export default withAITracking(ai.reactPlugin, Footer);
