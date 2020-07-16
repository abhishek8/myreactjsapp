// import React, { Component } from "react";
// import { ReCaptcha } from "react-recaptcha-google";
import React, { useRef } from "react";
import { ReCaptcha } from "react-recaptcha-v3";
import { GoogleReCaptcha as ReCaptchaSettings } from "../../config";

function GoogleReCaptcha(props) {
  const recaptcha = useRef(null);

  //   const verifyCallback = (recaptchaToken) => {
  //     console.log(recaptchaToken, "<= your recaptcha token");
  //   };

  return (
    <ReCaptcha
      ref={recaptcha}
      sitekey={ReCaptchaSettings.SITE_KEY}
      action="submit"
      //   verifyCallback={verifyCallback}
    />
  );
}

export default GoogleReCaptcha;

// export class GoogleReCaptcha extends Component {
//   constructor(props) {
//     super(props);
//     this.onLoadReCaptcha = this.onLoadReCaptcha.bind(this);
//     this.verifyCallback = this.verifyCallback.bind(this);
//   }

//   componentDidMount() {
//     if (this.captchaDemo) {
//       this.captchaDemo.reset();
//     }
//   }

//   onLoadReCaptcha() {
//     if (this.captchaDemo) {
//       this.captchaDemo.reset();
//     }
//   }

//   verifyCallback(recaptchaToken) {
//     console.log("ReCaptcha: ", recaptchaToken);
//   }

//   render() {
//     return (
//       <div>
//         <ReCaptcha
//           ref={(el) => {
//             this.captchaDemo = el;
//           }}
//           size="normal"
//           data-theme="dark"
//           render="explicit"
//           sitekey="6Ld5iq4ZAAAAACobIDjCdv2cYWKxDt72AwxOkBJ0"
//           onLoadCallback={this.onLoadReCaptcha}
//           verifyCallback={this.verifyCallback}
//         />
//       </div>
//     );
//   }
// }

// export default GoogleReCaptcha;
