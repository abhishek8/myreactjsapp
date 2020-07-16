//Github Usernames : gaearon, sophiebits, sebmarkbage, bvaughn

import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import DefaultRoute from "./layouts/DefaultLayout";
import LoginRoute from "./layouts/LoginLayout";
import requireAuth from "./services/authService";
import { UserProvider } from "./userContext";
//import { loadReCaptcha } from "react-recaptcha-google";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { loadReCaptcha } from "react-recaptcha-v3";
import { GoogleReCaptcha } from "./config";
import Loading from "./components/shared/Loading";

const Home = lazy(() => import("./components/Home"));
//const UserLogin = lazy(() => import("./components/UserLogin"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const BrowseCourses = lazy(() => import("./components/BrowseCourses"));
const Profile = lazy(() => import("./components/Profile"));
const Video = lazy(() => import("./components/Video"));
const MyCourse = lazy(() => import("./components/MyCourse"));
const UserSubscription = lazy(() => import("./components/UserSubscription"));
const CourseForm = lazy(() => import("./components/shared/CourseForm"));
const ReviewCourses = lazy(() => import("./components/ReviewCourses"));
const Cart = lazy(() => import("./components/Cart"));
const ForgotPassword = lazy(() => import("./components/shared/ForgotPassword"));
const PasswordReset = lazy(() => import("./components/shared/PasswordReset"));
const ChooseLogin = lazy(() => import("./components/ChooseLogin"));
const ChooseRegister = lazy(() => import("./components/ChooseRegister"));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#231E28",
    },
    secondary: {
      main: "#FD5F07",
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isTrainer: false,
      isReviewer: false,
      isUser: false,
      setLogin: this.setLoginIn.bind(this),
    };
    this.setLoginIn = this.setLoginIn.bind(this);
  }

  componentDidMount() {
    loadReCaptcha(GoogleReCaptcha.SITE_KEY);
    let userData = JSON.parse(sessionStorage.getItem("user_info"));
    this.setState({
      isLoggedIn: sessionStorage.getItem("auth_cookie") ? true : false,
      isUser: userData && userData.role && userData.role === "user",
      isTrainer: userData && userData.role && userData.role === "trainer",
      isReviewer: userData && userData.role && userData.role === "reviewer",
    });
  }

  setLoginIn(val) {
    let userData = JSON.parse(sessionStorage.getItem("user_info"));
    this.setState({
      isLoggedIn: val,
      isUser: userData && userData.role && userData.role === "user",
      isTrainer: userData && userData.role && userData.role === "trainer",
      isReviewer: userData && userData.role && userData.role === "reviewer",
    });
  }

  render() {
    return (
      <div className="">
        <ThemeProvider theme={theme}>
          <UserProvider value={this.state}>
            <Router>
              <Suspense fallback={<Loading />}>
                <Switch>
                  <DefaultRoute exact path="/" component={Home} />
                  <DefaultRoute path="/login" component={ChooseLogin} />
                  <LoginRoute path="/app-login/:role?" component={Login} />
                  <LoginRoute
                    path="/forgot-password"
                    component={ForgotPassword}
                  />
                  <LoginRoute
                    path="/password-reset"
                    component={PasswordReset}
                  />
                  <DefaultRoute path="/register" component={ChooseRegister} />
                  <Route path="/app-register/:role?" component={Register} />

                  <DefaultRoute
                    path="/profile"
                    component={requireAuth(Profile)}
                  />
                  <DefaultRoute path="/browse/:id?" component={BrowseCourses} />
                  <DefaultRoute
                    path="/video/:id"
                    component={requireAuth(Video)}
                  />
                  <DefaultRoute
                    path="/course/create/:id?"
                    component={requireAuth(CourseForm)}
                  />
                  <DefaultRoute
                    path="/course/my-course"
                    component={requireAuth(MyCourse)}
                  />
                  <DefaultRoute
                    path="/course/subscription"
                    component={requireAuth(UserSubscription)}
                  />
                  <DefaultRoute
                    path="/course/review"
                    component={requireAuth(ReviewCourses)}
                  />
                  <DefaultRoute
                    path="/user/cart"
                    component={requireAuth(Cart)}
                  />
                  {!this.state.isLoggedIn && <Redirect push to="/login" />}
                </Switch>
              </Suspense>
            </Router>
          </UserProvider>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
