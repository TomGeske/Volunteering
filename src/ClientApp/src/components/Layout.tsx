import * as React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer'

export class Layout extends React.Component {
  render() {
    return (
      <div>
        <NavMenu collapsed={true} />
        <div className="jumbotron">
          <Container>
            <h1 className="display-4 text-center">Microsoft Volunteering</h1>
            <p className="small-banner text-center">Feel good while doing good</p>
          </Container>
        </div>
        <Container>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
