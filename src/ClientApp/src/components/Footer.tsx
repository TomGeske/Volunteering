﻿import * as React from 'react';

export class Footer extends React.Component {
  public render(): React.ReactNode {
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
                <h2 className="feedback-header text-uppercase">Do you have feedback?</h2>
                <p>
                  Please <a className="footer-anchor" href="https://github.com/TomGeske/Volunteering/issues/new">file an issue</a>
                </p>
                {/* Content */}
              </div>
              {/* Grid column */}
              <hr className="clearfix w-100 d-md-none pb-3" />
              {/* Grid column */}
              <div className="col-md-3 mb-md-0 mb-3" />
              {/* Grid column */}

              {/* Grid column */}
              <div className="col-md-3 mb-md-0 mb-3">
                <span>
                  Microsoft confidential. For use only by Microsoft​
                  employees and approved vendors working on​​​behalf of​​ Microsoft.&nbsp;
                  <a className="footer-anchor" href="https://microsoft.sharepoint.com/teams/msdpn/sitepages/default.aspx">Data protection notice​​.</a>
                </span>
              </div>
              {/* Grid column */}
            </div>
            {/* Grid row */}
          </div>
          {/* Footer Links */}
          {/* Copyright */}
          <div className="footer-copyright text-center py-3">
            &copy; Microsoft&nbsp;
            {new Date().getFullYear()}
          </div>
          {/* Copyright */}
        </footer>
        {/* Footer */}
      </div>
    );
  }
}
