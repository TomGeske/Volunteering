import * as React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

interface IState {
  show: boolean;
}

interface IProps {
  event: IEvent;
}

interface IEvent {
  name: string;
}

export default class EventSignUp extends React.Component<IProps, IState> {
  State: IState =
    { show: false };

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  private handleRegister() {
    this.handleClose();
    // call Registration and pass user & event
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

        <Modal isOpen={this.State.show} defaultChecked>
          <ModalHeader>
            Event Registration
          </ModalHeader>
          <ModalBody>
            Please, confirm that<br />
            <ol>
              <li>You have approval from your line manager</li>
              <li>You entered your your days in //msvacation in <a href="https://msvacation">https://msvacation</a></li>
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleRegister}>
              Register
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
