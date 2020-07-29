// import React from "react";
// import Form from "react-bootstrap/Form";
// import FormControl from "react-bootstrap/FormControl";
// import InputGroup from "react-bootstrap/InputGroup";
// import BootstrapButton from "react-bootstrap/Button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import { faKey } from "@fortawesome/free-solid-svg-icons";
// import GoogleLogin from "react-google-login";
// import { Google } from "../config";
// //import LoginService from "../services/loginService";
// import { UserConsumer } from "../userContext";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import UserService from "../services/userService";
// import AppUtils from "../utilities/AppUtils";

// class LoginComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: "",
//       password: "",
//     };

//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
//     this.handleGoogleLoginFailure = this.handleAuthFailure.bind(this);
//     this.navigateAfterLogin = this.navigateAfterLogin.bind(this);
//     this.authenticateUser = this.authenticateUser.bind(this);
//   }

//   navigateAfterLogin() {
//     let search = this.props.location.search;
//     let returnURL = new URLSearchParams(search).get("return");
//     this.props.history.push(returnURL ? returnURL : "/");
//   }

//   authenticateUser(email, password, authToken = "") {
//     let userRole = this.props.role ? this.props.role : "user";
//     let userService = new UserService();
//     switch (userRole) {
//       case "trainer":
//         return userService.signInAsTrainer({ email, password, authToken });
//       case "reviewer":
//         return userService.signInAsReviewer({ email, password, authToken });
//       case "admin":
//         return userService.signInAsAdmin({ email, password, authToken });
//       default:
//         return userService.signInAsUser({ email, password, authToken });
//     }
//   }

//   async handleSubmit(event) {
//     event.preventDefault();

//     let { username, password } = this.state;
//     const result = await this.authenticateUser(username, password);

//     if (result && result.success === true) {
//       sessionStorage.setItem("auth_cookie", result.data.token.toString());
//       sessionStorage.setItem("user_info", JSON.stringify(result.data));
//       this.navigateAfterLogin();
//     } else {
//       this.handleAuthFailure(result);
//     }
//   }

//   async handleGoogleLogin(response) {
//     let res = response.profileObj;
//     console.log(response.profileObj);

//     if (res) {
//       const result = await this.authenticateUser(
//         res.email,
//         "",
//         response.wc.id_token
//       );

//       if (result && result.success === true) {
//         sessionStorage.setItem("auth_cookie", result.data.token.toString());
//         sessionStorage.setItem("user_info", JSON.stringify(result.data));
//         this.navigateAfterLogin();
//       } else {
//         this.handleAuthFailure(result);
//       }
//     }
//   }

//   handleAuthFailure(err) {
//     confirmAlert({
//       title: "Authentication Failed",
//       message: err && err.error ? err.error : "",
//       buttons: [
//         {
//           label: "Ok",
//           onClick: () => {},
//         },
//       ],
//       closeOnEscape: true,
//       closeOnClickOutside: true,
//     });
//   }

//   render() {
//     return (
//       <div>
//         <UserConsumer>
//           {(value) => {
//             return (
//               <div className="d-flex justify-content-center">
//                 <Form
//                   onSubmit={(e) => {
//                     this.handleSubmit(e).then((res) => {
//                       value.setLogin(true);
//                     });
//                   }}
//                 >
//                   <InputGroup className="mb-2">
//                     <GoogleLogin
//                       clientId={Google.CLIENT_ID}
//                       buttonText="Login with Google"
//                       onSuccess={(e) => {
//                         this.handleGoogleLogin(e).then((res) => {
//                           value.setLogin(true);
//                         });
//                       }}
//                       onFailure={this.handleAuthFailure}
//                     ></GoogleLogin>
//                   </InputGroup>
//                   <h6 className="d-flex justify-content-center">Or</h6>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Prepend>
//                       <InputGroup.Text id="basic-addon1">
//                         <FontAwesomeIcon icon={faUser} />
//                       </InputGroup.Text>
//                     </InputGroup.Prepend>
//                     <FormControl
//                       placeholder="Username"
//                       aria-label="Username"
//                       aria-describedby="basic-addon1"
//                       value={this.state.username}
//                       onChange={(event) =>
//                         this.setState({ username: event.target.value })
//                       }
//                       required={true}
//                     />
//                   </InputGroup>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Prepend>
//                       <InputGroup.Text id="basic-addon1">
//                         <FontAwesomeIcon icon={faKey} />
//                       </InputGroup.Text>
//                     </InputGroup.Prepend>
//                     <FormControl
//                       placeholder="Password"
//                       aria-label="Password"
//                       aria-describedby="basic-addon1"
//                       type="password"
//                       value={this.state.password}
//                       onChange={(event) =>
//                         this.setState({ password: event.target.value })
//                       }
//                       required={true}
//                     />
//                   </InputGroup>
//                   <BootstrapButton variant="secondary" type="submit">
//                     Log In As {AppUtils.capitalize(this.props.role)}
//                   </BootstrapButton>
//                   <br />
//                   <br />
//                   <a href="/login/forgot-password">Forgot Password?</a>
//                 </Form>
//               </div>
//             );
//           }}
//         </UserConsumer>
//       </div>
//     );
//   }
// }

// export default LoginComponent;
