import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import UserService from "../../services/userService";
import {
  Avatar,
  Typography,
  makeStyles,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const useStyles = makeStyles((theme) => ({
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

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [message, setMessage] = useState("");

  const classes = useStyles();

  const onSubmit = async (value) => {
    toggleLoading(true);
    let userService = new UserService();
    let result = await userService.forgotPassword(value.email);
    if (result && result.success) {
      setMessage(`Password Reset link has been successfully sent to your registered
      email.`);
      setSent(true);
    } else {
      setMessage(`Something went wrong. Please try again later`);
    }
    toggleLoading(false);
  };

  return (
    <>
      <Backdrop
        open={loading}
        style={{ zIndex: 35001 }}
        onClick={() => toggleLoading(false)}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot Password
      </Typography>
      {sent && (
        <Typography variant="h6" component="body">
          {message}
        </Typography>
      )}
      {!sent && (
        <>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid Email Format")
                .max(50, "Max 50 characters or less")
                .required("Required"),
            })}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form className={classes.form} noValidate>
                <FormikControl
                  control="input"
                  type="email"
                  label="Email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                <FormikControl
                  className={classes.submit}
                  control="submit"
                  label="Confirm"
                />
              </Form>
            )}
          </Formik>
          {message.length > 0 && (
            <Typography color="secondary" variant="h6" component="body">
              {message}
            </Typography>
          )}
        </>
      )}
    </>
  );
}

export default ForgotPassword;
