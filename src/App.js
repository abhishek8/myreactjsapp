//Github Usernames : gaearon, sophiebits, sebmarkbage, bvaughn

import React, { Suspense, lazy, useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DefaultRoute from "./layouts/DefaultLayout";
import LoginRoute from "./layouts/LoginLayout";
import requireAuth from "./services/authService";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { loadReCaptcha } from "react-recaptcha-v3";
import { GoogleReCaptcha } from "./config";
import Loading from "./components/shared/Loading";
import { UserContext, UserReducer } from "./context/UserContext";
import { CartContext, CartReducer } from "./context/CartContext";

const Home = lazy(() => import("./components/Home"));
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
const CreateCourse = lazy(() => import("./components/CreateCourse"));

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

function App() {
  const cartStorage = sessionStorage.getItem("app_cart");
  const localCart = cartStorage ? JSON.parse(cartStorage) : [];
  const userLocalInfo = JSON.parse(sessionStorage.getItem("user_info"));
  const authToken = sessionStorage.getItem("auth_cookie");

  const [user, userDispatch] = useReducer(UserReducer, {
    isAuthenticated: authToken && authToken.length > 0,
    user: userLocalInfo,
    token: authToken,
  });
  const [cart, cartDispatch] = useReducer(CartReducer, [...localCart]);

  useEffect(() => {
    loadReCaptcha(GoogleReCaptcha.SITE_KEY);
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <UserContext.Provider
          value={{ userState: user, userDispatch: userDispatch }}
        >
          <CartContext.Provider
            value={{ cartState: cart, cartDispatch: cartDispatch }}
          >
            <Router>
              <Suspense fallback={<Loading open={true} />}>
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
                    path="/course/edit/:id?"
                    component={requireAuth(CourseForm, ["trainer"])}
                  />
                  <DefaultRoute
                    path="/course/new"
                    component={requireAuth(CreateCourse, ["trainer"])}
                  />
                  <DefaultRoute
                    path="/course/my-course"
                    component={requireAuth(MyCourse, ["trainer"])}
                  />
                  <DefaultRoute
                    path="/course/subscription"
                    component={requireAuth(UserSubscription, ["user"])}
                  />
                  <DefaultRoute
                    path="/course/review"
                    component={requireAuth(ReviewCourses, ["reviewer"])}
                  />
                  <DefaultRoute
                    path="/user/cart"
                    component={requireAuth(Cart, ["user"])}
                  />
                </Switch>
              </Suspense>
            </Router>
          </CartContext.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
