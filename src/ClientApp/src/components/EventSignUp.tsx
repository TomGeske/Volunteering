import * as React from 'react';
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Event } from '../entities/Event'
import {
  authContext,
  adalApiFetch
} from '../adalConfig';
import { Registration } from '../entities/Registration';

interface State {
  show: boolean;
  uiState: 'Processing' | 'Open' | 'registration_successfull' | 'registration_failed' | 'registration_withdrawal_successfull' | 'registration_withdrawal_failed';
}

interface Props {
  event: Event;
  onRegister?: RegistrationEventHandler;
  onWithdraw?: RegistrationEventHandler;
}

type RegistrationEventHandler = (input: Registration) => void

export default class EventSignUp extends React.Component<Props, State> {
  public state: State = {
    uiState: "Open",
    show: false,
  }

  public constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  private handleWithdraw(): void {
    this.setState({ uiState: 'Processing' });

    adalApiFetch(`api/Event/WithdrawalEvent/${this.props.event.id}`)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          const regIndex: number = this.getRegistrationIndex();
          const reg = this.props.event.registrations[regIndex];

          if (regIndex >= 0) {
            this.props.event.registrations.splice(regIndex);
          }

          if (this.props.onWithdraw) {
            this.props.onWithdraw(reg);
          }

          this.setState(
            {
              uiState: 'registration_withdrawal_successfull',
              show: false
            });
        } else {
          this.setState({ uiState: 'registration_withdrawal_failed' });
        }
      });
  }

  private handleRegister(): void {
    this.setState({ uiState: 'Processing' });

    adalApiFetch(`api/Event/AddRegistration/${this.props.event.id}`)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          this.setState({ uiState: 'registration_successfull' });

          const newRegistration: Registration = {
            userId: authContext.getCachedUser().userName,
            createdTS: new Date(Date.now()),
            name1: authContext.getCachedUser().userName,
            name2: authContext.getCachedUser().profile.lastName,
          };

          this.props.event.registrations.push(newRegistration);

          if (this.props.onRegister) {
            this.props.onRegister(newRegistration);
          }
        } else {
          this.setState({ uiState: 'registration_failed' });
        }
      });
  }

  private handleClose(): void {
    if (this.state.uiState === 'registration_successfull') {
      this.setState({ show: false })
    }
    else {
      this.setState({ show: false })
    }
  }

  private handleShow(): void {
    this.setState({ show: true })
  }

  private renderStatusMessages(): JSX.Element {
    if (this.state.uiState === 'registration_successfull') {
      return (
        <Alert color="success">
          Registration successfull
        </Alert>
      );
    } else if (this.state.uiState === 'registration_failed') {
      return (
        <Alert color="danger">
          Registration failed. Please try again later.
        </Alert>
      );
    } else {
      return (
        <></>
      );
    }
  }

  private getRegistrationIndex(): number {
    if (this.props.event.registrations == null) {
      return -1;
    }

    const userId: string = authContext.getCachedUser().userName;

    for (let i = 0; i < this.props.event.registrations.length; i++) {
      if (this.props.event.registrations[i].userId == userId) {
        return i;
      }
    }

    return -2;
  }

  private IsRegistered(): boolean {
    if (this.getRegistrationIndex() < 0) {
      return false;
    }
    else {
      return true;
    }
  }

  public render(): React.ReactNode {

    if (this.IsRegistered()) {
      return (
        <p>
          <b>You are registered</b>
          <br />
          <Button variant="primary" onClick={this.handleWithdraw}>
            Withdraw
          </Button>
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
              <Button variant="primary" onClick={this.handleRegister}
                disabled={this.state.uiState === "Processing" || this.state.uiState === "registration_successfull" ? true : false}
              >
                {this.state.uiState === "Processing" ? 'Registering' : 'I agree'}
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    }
  }
}
