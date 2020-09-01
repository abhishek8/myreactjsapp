import React, { useState, useEffect, useContext } from "react";
import GoogleLogin from "react-google-login";
import { Google } from "../config";
import UserService from "../services/userService";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import { loadCSS } from "fg-loadcss";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { UserContext } from "../context/UserContext";
import Loading from "./shared/Loading";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const userService = new UserService();
  const { params } = props.match;
  const userRole = params.role ? params.role : "user";

  const userContext = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const getHeader = () => {
    switch (params.role) {
      case "trainer":
        return " as Trainer";
      case "reviewer":
        return " as Reviewer";
      case "admin":
        return " as Admin";
      default:
        return "";
    }
  };

  const navigateAfterLogin = () => {
    let search = props.location.search;
    let returnURL = new URLSearchParams(search).get("return");
    props.history.push(returnURL ? returnURL : "/");
  };

  const authenticateUser = (email, password, authToken = "") => {
    switch (userRole) {
      case "trainer":
        return userService.signInAsTrainer({ email, password, authToken });
      case "reviewer":
        return userService.signInAsReviewer({ email, password, authToken });
      case "admin":
        return userService.signInAsAdmin({ email, password, authToken });
      default:
        return userService.signInAsUser({ email, password, authToken });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(true);
    authenticateUser(email, password).then((result) => {
      if (result && result.success === true) {
        const payload = {
          userInfo: result.data,
          token: result.data.token,
          rememberMe: remember,
        };
        userContext.userDispatch({ type: "LOGIN", payload: payload });
        navigateAfterLogin();
      } else {
        handleAuthFailure(result);
      }
    });
  };

  const handleGoogleLogin = async (response) => {
    let res = response.profileObj;
    setOpen(true);
    if (res) {
      const result = await authenticateUser(
        res.email,
        "",
        response.wc.id_token
      );

      if (result && result.success === true) {
        const payload = {
          userInfo: result.data,
          token: result.data.token.toString(),
          rememberMe: remember,
        };
        userContext.userDispatch({ type: "LOGIN", payload: payload });
        navigateAfterLogin();
      } else {
        handleAuthFailure(result);
      }
    }
  };

  const handleAuthFailure = (err) => {
    setOpen(false);
    confirmAlert({
      title: "Authentication Failed",
      message: err && err.error ? err.error : "",
      buttons: [
        {
          label: "Ok",
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  return (
    <>
      <Loading open={open} />
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in {getHeader()}
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              color="primary"
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
      <br />
      <Typography variant="body2" component="h5" gutterBottom>
        Or continue with
      </Typography>
      <Grid container spacing={8} justify="center">
        <Grid item>
          <GoogleLogin
            clientId={Google.CLIENT_ID}
            buttonText=""
            onSuccess={handleGoogleLogin}
            onFailure={handleAuthFailure}
            render={(renderProps) => (
              <IconButton color="primary" onClick={renderProps.onClick}>
                <Icon className="fab fa-google" color="primary" />
              </IconButton>
            )}
          ></GoogleLogin>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
