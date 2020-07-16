import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import UserService from "../../services/userService";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  makeStyles,
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

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
      "Password must be at least 4 characters, no more than 8 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit"
    ),
  confirmPassword: Yup.string()
    .required("Required")
    .test("match", "Password do not match", function (passConfirm) {
      return passConfirm === this.parent.password;
    }),
});

function PasswordReset(props) {
  const [dialog, toggleDialog] = useState(false);
  const [message, setMessage] = useState("");

  const classes = useStyles();

  const onSubmit = async (value) => {
    const path = props.location.search;
    let token = new URLSearchParams(path).get("token");
    let username = new URLSearchParams(path).get("username");
    let result = await new UserService().resetPassword(
      username,
      token,
      value.password
    );
    if (result && result.success && result.message) {
      setMessage(`Your password has been successfully reset. Please sign in to verify.
      If found issue you can get in touch with tech support.`);
    } else {
      setMessage(
        `Unable to reset token. Please try again. If facing issue with password reset, please get in touch with our tech support.`
      );
    }
    toggleDialog(true);
  };

  const handleClose = (e) => {
    toggleDialog(false);
    props.history.push("/login");
  };

  return (
    <>
      <Dialog open={dialog} onClose={handleClose}>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={classes.form} noValidate>
            <FormikControl
              control="input"
              type="password"
              label="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            <FormikControl
              control="input"
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            <FormikControl
              className={classes.submit}
              control="submit"
              label="Reset Password"
            />
          </Form>
        )}
      </Formik>
    </>
  );
}

export default PasswordReset;
