import * as React from 'react';
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import {
  authContext,
  adalConfig,
} from '../adalConfig';

interface IState {
  show: boolean;
  uiState: string;
}

interface IProps {
  event: IEvent;
}

interface IEvent {
  id: string;
  name: string;
}

export default class EventSignUp extends React.Component<IProps, IState> {
  state: IState = {
    uiState: 'open',
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
    this.setState({ show: false })
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

  public render() {
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
