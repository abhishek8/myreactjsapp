import React, { Component } from "react";
import { ReCaptcha } from "react-recaptcha-google";

export class SiteReCaptcha extends Component {
  componentDidMount() {
    if (this.googleCaptcha) {
      this.googleCaptcha.reset();
    }
  }

  onLoadRecaptcha() {
    if (this.googleCaptcha) {
      this.googleCaptcha.reset();
    }
  }

  render() {
    return (
      <div className="">
        {window.grecaptcha && (
          <ReCaptcha
            ref={(el) => {
              this.googleCaptcha = el;
            }}
            size="normal"
            data-theme="dark"
            render="explicit"
            sitekey="6LekZLEZAAAAAKiCzEjnK1Ec0ST0LaoWouvCNc81"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={(token) => {
              this.props.formik.setFieldValue(this.props.name, token);
            }}
          />
        )}
      </div>
    );
  }
}

export default SiteReCaptcha;
