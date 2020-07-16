import React from "react";
import { ErrorMessage } from "formik";
//import SiteReCaptcha from "./SiteReCaptcha";
//import GoogleReCaptcha from "./GoogleReCaptcha";
import { ReCaptcha } from "react-recaptcha-v3";
import { GoogleReCaptcha as ReCaptchaSettings } from "../../config";

import {
  Box,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextareaAutosize,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

const renderErrorMessage = (name) => {
  return (
    <ErrorMessage name={name}>
      {(err) => <span className="text-danger">{err}</span>}
    </ErrorMessage>
  );
};

function FormikControl(props) {
  const { control, label, name, options, ...rest } = props;
  switch (control) {
    case "input":
      return (
        <Box margin={1}>
          <TextField
            variant="outlined"
            name={name}
            label={label}
            helperText={renderErrorMessage(name)}
            fullWidth={true}
            {...rest}
          />
          {/* <label htmlFor={name}>{label}</label>
          <Field
            name={name}
            {...rest}
            placeholder={label}
            className="form-control"
          /> */}
        </Box>
      );
    case "textarea":
      return (
        <Box margin={1}>
          <FormControl variant="outlined">
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <TextareaAutosize
              name={name}
              label={label}
              placeholder={`Enter ${label}`}
              rowsMin={rest.minRow ? rest.minRow : 3}
              rowsMax={rest.maxRow ? rest.maxRow : 6}
              fullWidth={true}
            />
          </FormControl>
          {renderErrorMessage(name)}
        </Box>
      );
    case "select":
      return (
        <Box margin={1}>
          <FormControl variant="outlined" style={{ minWidth: 600 }}>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <Select
              style={{ minWidth: "320" }}
              name={name}
              label={label}
              fullWidth={true}
              {...rest}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {options.map((val) => (
                <MenuItem value={val.key} key={val.key}>
                  {val.value}
                </MenuItem>
              ))}
            </Select>
            {renderErrorMessage(name)}
            {/* <label htmlFor={name}>{label}</label>
          <select name={name} {...rest} className="form-control">
            <option value=""> Select </option>
            {options.map((val) => (
              <option key={val.key} value={val.key}>
                {val.value}
              </option>
            ))}
          </select>
          {renderErrorMessage(name)} */}
          </FormControl>
        </Box>
      );
    case "recaptcha":
      return (
        <Box margin={1}>
          {/* <SiteReCaptcha name={name} {...rest} /> */}
          {/* <GoogleReCaptcha name={name} {...rest} /> */}
          <ReCaptcha
            name={name}
            sitekey={ReCaptchaSettings.SITE_KEY}
            action="submit"
            {...rest}
          />
          {renderErrorMessage(name)}
        </Box>
      );
    case "checkTerms":
      return (
        <>
          <FormControlLabel
            control={<Checkbox name={name} color="primary" />}
            label={label}
            {...rest}
          />
          <br />
          {renderErrorMessage(name)}
        </>
      );
    case "submit":
      return (
        <Box margin={2}>
          <Button type="submit" variant="contained" color="primary">
            {label ? label : "Submit"}
          </Button>
        </Box>
      );
    default:
      return null;
  }
}

export default FormikControl;
