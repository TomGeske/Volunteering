import * as React from 'react';
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { IEvent } from '../entities/IEvent'
import {
  authContext,
  adalConfig,
} from '../adalConfig';

interface IState {
  show: boolean;
  uiState: 'Open' | 'registration_successfull' | 'registration_failed';
}

interface IProps {
  event: IEvent;
}

export default class EventSignUp extends React.Component<IProps, IState> {
  state: IState = {
    uiState: "Open",
    show: false,
  }

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  private handleRegister() {
    // call Registration and pass user & event
    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch(`api/Event/AddRegistration/${this.props.event.id}`,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      }
    ).then(response => {
      if (response.status === 200 || response.status === 201) {
        this.setState({ uiState: 'registration_successfull' });
      } else {
        this.setState({ uiState: 'registration_failed' });
      }
    });
  }

  private handleClose() {
    if (this.state.uiState === 'registration_successfull') {
      // ToDo: refresh page
      //this.props.history.push('/eventdetails/' + this.props.event.id)
      this.setState({ show: false })
    }
    else {
      this.setState({ show: false })
    }
  }

  private handleShow() {
    this.setState({ show: true })
  }

  private renderStatusMessages() {
    if (this.state.uiState === 'registration_successfull') {
      return (
        <Alert color="success">
          Registration successfull
        </Alert>
      );
    } else if (this.state.uiState === 'registration_failed') {
      return (
        <Alert color="danger">
          Registration failed.
        </Alert>
      );
    } else {
      return null;
    }
  }

  private IsRegistered() {
    if (this.props.event.registrations == null) {
      return false;
    }

    var userId: string = authContext.getCachedUser().userName;

    for (let i = 0; i < this.props.event.registrations.length; i++) {
      if (this.props.event.registrations[i].userId == userId) {
        return true;
      }
    }

    return false;
  }

  public render() {

    if (this.IsRegistered()) {
      return (
        <p>
          <b>You are registered</b>
        </p>
      );
    }
    else {
      return (
        <>
          <Button variant="primary" onClick={this.handleShow}>
            Register
          </Button>

          <Modal isOpen={this.state.show} defaultChecked >
            <ModalHeader>
              Event Registration:&nbsp;{this.props.event.name}
            </ModalHeader>
            <ModalBody>
              {this.renderStatusMessages()}
              Please, confirm:<br />
              <ol>
                <li>You have approval from your line manager</li>
                <li>You entered your volunteering days in <a href="https://msvacation" target="_blank">https://msvacation</a></li>
              </ol>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
            </Button>
              <Button variant="primary" onClick={this.handleRegister}>
                I agree
            </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    }
  }
}
