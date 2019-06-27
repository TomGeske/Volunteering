import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Form,
} from 'reactstrap';
import { FormControl } from 'react-bootstrap';
import { authContext } from '../adalConfig';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light expand="lg">
          <NavbarBrand tag={Link} to="/">
            <img
              src="images/microsoft-gray.png"
              width="180"
              className="d-inline-block align-top"
              alt="Microsoft Logo"
            />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />

          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/events">Events</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">
                  Signed in&nbsp;
                  {authContext.getCachedUser().userName}
                </NavLink>
              </NavItem>
              <NavItem>
                <Form inline>
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                </Form>
              </NavItem>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
