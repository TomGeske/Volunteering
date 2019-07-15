import * as React from 'react';
import {
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
}

interface IProps {
  event: IEvent;
}

interface IEvent {
  id: string;
  name: string;
}

export default class EventSignUp extends React.Component<IProps, IState> {
  state = {
    show: false,
  }

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  private handleRegister() {
    this.handleClose();
    // call Registration and pass user & event
    var token = authContext.getCachedToken(adalConfig.endpoints.api);

    fetch(`api/Event/AddRegistration/${this.props.event.id}`,
      {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      }
    );
  }

  private handleClose() {
    this.setState({ show: false })
  }

  private handleShow() {
    this.setState({ show: true })
  }

  public render() {
    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Register
        </Button>

        <Modal isOpen={this.state.show} defaultChecked>
          <ModalHeader>
            Event Registration {this.props.event.name}
          </ModalHeader>
          <ModalBody>
            Please, confirm:<br />
            <ol>
              <li>You have approval from your line manager</li>
              <li>You entered your volunteering days in <a href="https://msvacation">https://msvacation</a></li>
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
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
