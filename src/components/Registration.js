import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./shared/FormikControl";
import GoogleLogin from "react-google-login";
import { Google } from "../config";
import UserService from "../services/userService";
//import GoogleReCaptcha from "./shared/GoogleReCaptcha";

const initialValues = {
  name: "",
  email: "",
  profileImg: "",
  //role: "",
  recaptcha: "",
};

const validationSchema = Yup.object({
  name: Yup.string().max(50, "Max 50 characters or less").required("Required"),
  email: Yup.string()
    .email("Invalid Email Format")
    .max(50, "Max 50 characters or less")
    .required("Required"),
  profileImg: Yup.string(),
  //role: Yup.string().required("Required"),
  recaptcha: Yup.string().required("Validation Error!"),
});

function Registration(props) {
  const onSubmit = async (data) => {
    data["role"] = props.role;
    const service = new UserService();
    let result = await service.registerUser(data);
    if (result && result.message) {
      alert(result.message);
      props.location.push("/login");
    } else {
      alert("Unknown error!");
    }
  };

  const handleGoogleRegistration = async (response) => {
    console.log(response);
    if (response && response.profileObj) {
      let profile = response.profileObj;
      const data = {
        email: profile.email,
        name: profile.name,
        profileImage: profile.imageUrl,
        googleId: profile.googleId,
        role: props.role,
      };
      const service = new UserService();
      let result = await service.registerUser(data);
      let message;
      if (result)
        message = result.success ? result["message"] : result["error"];
      alert(message ? message : "Unknown Error!");
    }
  };

  const handleGoogleRegFailed = (err) => {
    console.log(err);
  };

  return (
    <div className="d-flex justify-content-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <GoogleLogin
              clientId={Google.CLIENT_ID}
              buttonText="Register with Google"
              onSuccess={handleGoogleRegistration}
              onFailure={handleGoogleRegFailed}
              className="mb-2"
            ></GoogleLogin>
            <h6 className="d-flex justify-content-center">Or</h6>
            <FormikControl
              control="input"
              type="text"
              label="Name"
              name="name"
            />
            <FormikControl
              control="input"
              type="email"
              label="Email"
              name="email"
            />
            {/* <FormikControl
              control="input"
              type="text"
              label="Profile Image"
              name="profileImg"
            /> */}
            {/* <FormikControl
              control="select"
              name="role"
              label="Role"
              options={[
                { key: "user", value: "User" },
                { key: "trainer", value: "Trainer" },
                { key: "reviewer", value: "Reviewer" },
              ]}
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            /> */}
            <FormikControl
              control="recaptcha"
              name="recaptcha"
              formik={formik}
            />
            {/* <FormikControl
              control="input"
              type="password"
              label="Password"
              name="password"
            />
            <FormikControl
              control="input"
              type="password"
              label="Confirm Password"
              name="confirmPass"
            /> */}
            {/* <GoogleReCaptcha /> */}
            <FormikControl control="submit" />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Registration;
