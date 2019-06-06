import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer'

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
      <div>
        <NavMenu />
        <div className="jumbotron">
          <container>
            <h1 className="display-4 text-center">Microsoft Volunteering</h1>
            <h3 className="display-6 text-center">Feel good while doing good</h3>
          </container>
        </div>
        <Container>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
