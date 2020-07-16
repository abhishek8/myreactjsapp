import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./shared/FormikControl";
import GoogleLogin from "react-google-login";
import { Google } from "../config";
import UserService from "../services/userService";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Icon from "@material-ui/core/Icon";

import { loadCSS } from "fg-loadcss";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Backdrop, CircularProgress, Toolbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(2),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialValues = {
  fname: "",
  lname: "",
  email: "",
  recaptcha: "",
  accept: false,
};

const validationSchema = Yup.object({
  fname: Yup.string().max(50, "Max 50 characters or less").required("Required"),
  lname: Yup.string().max(50, "Max 50 characters or less"),
  email: Yup.string()
    .email("Invalid Email Format")
    .max(50, "Max 50 characters or less")
    .required("Required"),
  recaptcha: Yup.string(),
  accept: Yup.bool()
    .oneOf([true], "Please accept the terms and conditions!")
    .required("Required"),
});

function Register(props) {
  const classes = useStyles();
  const { params } = props.match;
  const service = new UserService();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const registerUser = async (val) => {
    let name = val.name
      ? val.name
      : val.fname + (val.lname ? " " + val.lname : "");
    const data = {
      name,
      email: val.email,
      profileImage: val.imageUrl ? val.imageUrl : "",
      googleId: val.googleId ? val.googleId : "",
      role: params.role ? params.role : "user",
    };
    console.log(data);

    let result = await service.registerUser(data);

    if (result && result.message) {
      handleReqSuccess(result.message);
    } else {
      handleRegFailed("Unknown error!");
    }
  };

  const onSubmit = (val) => {
    setOpen(true);
    registerUser(val);
  };

  const handleGoogleRegistration = (response) => {
    if (response && response.profileObj) {
      setOpen(true);
      registerUser(response.profileObj);
    }
  };

  const handleRegFailed = (err) => {
    setOpen(false);
    confirmAlert({
      title: "Registration Failed",
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

  const handleReqSuccess = (msg) => {
    setOpen(false);
    confirmAlert({
      title: "Registration Successful",
      message: `A confirmation mail will be sent to you. Please follow the steps provided in the mail to complete the registration process.`,
      buttons: [
        {
          label: "Ok",
          onClick: () => props.history.push("/login"),
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ backgroundColor: "#fff" }}
    >
      <CssBaseline />
      <Backdrop style={{ zIndex: 34001 }} open={open}>
        <CircularProgress color="primary" />
      </Backdrop>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikControl
                    control="recaptcha"
                    name="recaptcha"
                    verifyCallback={(token) =>
                      formik.setFieldValue("recaptcha", token)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikControl
                    control="input"
                    autoComplete="fname"
                    name="fname"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikControl
                    control="input"
                    variant="outlined"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lname"
                    autoComplete="lname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikControl
                    control="input"
                    type="email"
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikControl
                    control="checkTerms"
                    name="accept"
                    label="I agree to the terms and conditions."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <br />
        <Typography variant="body2" component="h5" gutterBottom>
          Or you can create your account with,
        </Typography>
        <Grid container spacing={8} justify="center">
          <Grid item>
            <GoogleLogin
              clientId={Google.CLIENT_ID}
              buttonText=""
              onSuccess={handleGoogleRegistration}
              onFailure={handleRegFailed}
              render={(renderProps) => (
                <IconButton color="primary" onClick={renderProps.onClick}>
                  <Icon className="fab fa-google" color="primary" />
                </IconButton>
              )}
            ></GoogleLogin>
          </Grid>
        </Grid>
        <Toolbar />
      </div>
    </Container>
  );
}

export default Register;
