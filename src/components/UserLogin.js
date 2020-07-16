import React, { Component } from "react";
import Registration from "./Registration";
import LoginComponent from "./LoginComponent";
import PasswordReset from "./shared/PasswordReset";
import ForgotPassword from "./shared/ForgotPassword";

export class UserLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderForm: "",
    };

    this.renderLogin = this.renderLogin.bind(this);
    this.renderUserRegistration = this.renderUserRegistration.bind(this);
  }

  componentDidMount() {
    let { params } = this.props.match;
    const renderPath = params.path;

    switch (renderPath) {
      case "password-reset":
        this.setState({
          renderForm: <PasswordReset {...this.props} />,
        });
        break;
      case "forgot-password":
        this.setState({
          renderForm: <ForgotPassword {...this.props} />,
        });
        break;
      default:
    }
  }

  renderUserRegistration(role) {
    this.setState({
      renderForm: <Registration role={role} {...this.props} />,
    });
  }

  renderLogin(role) {
    this.setState({
      renderForm: <LoginComponent role={role} {...this.props} />,
    });
  }

  render() {
    return (
      <div className="row" style={{ paddingTop: 20 }}>
        <div className="col-md-3">
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.renderUserRegistration("user")}
            >
              Register As User
            </button>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.renderUserRegistration("trainer")}
            >
              Register As Trainer
            </button>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.renderUserRegistration("reviewer")}
            >
              Register As Reviewer
            </button>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.renderLogin("user")}
            >
              Login As User
            </button>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.renderLogin("trainer")}
            >
              Login As Trainer
            </button>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.renderLogin("reviewer")}
            >
              Login As Reviewer
            </button>
          </div>
        </div>
        <div
          className="col-md-9"
          style={{ borderLeft: "0.5px solid lightgrey" }}
        >
          {this.state.renderForm}
        </div>
      </div>
    );
  }
}

export default UserLogin;
