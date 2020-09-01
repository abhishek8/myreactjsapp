import React from "react";
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  makeStyles,
  Button,
  Box,
} from "@material-ui/core";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";

const useStyles = makeStyles((theme) => ({
  summary: {
    padding: theme.spacing(2),
  },
  summaryItem: {
    margin: theme.spacing(2),
  },
}));

const validationSchema = Yup.object({
  name: Yup.string().max(25, "Max 25 characters or less").required("Required"),
  address: Yup.string()
    .max(100, "Max 100 characters or less")
    .required("Required"),
  contact: Yup.string()
    .matches(/^(?=.*\d).{9,11}$/, "Invalid contact number")
    .required("Required"),
});

function Checkout(props) {
  const classes = useStyles();

  const onSubmit = (val) => {
    props.purchase(val);
  };

  return (
    <>
      <br />
      <Typography variant="h5" component="h5" paragraph>
        Billing Details
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={9} md={6}>
          <Formik
            initialValues={{ name: "", address: "", contact: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form style={{ width: "100%" }}>
                <FormikControl
                  control="input"
                  type="text"
                  label="Name"
                  name="name"
                  size="small"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.name &&
                    formik.errors.name &&
                    formik.errors.name !== ""
                  }
                />
                <FormikControl
                  control="textarea"
                  label="Address"
                  name="address"
                  size="small"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.address &&
                    formik.errors.address &&
                    formik.errors.address !== ""
                  }
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Contact"
                  name="contact"
                  size="small"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.contact &&
                    formik.errors.contact &&
                    formik.errors.contact !== ""
                  }
                />
                <br />
                <Box style={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="primary"
                  >
                    Buy&nbsp;
                    <ShoppingBasketIcon />
                  </Button>
                </Box>
                {/* <FormikControl
                  control="submit"
                  label="Buy"
                  size="large"
                  style={{ textAlign: "center" }}
                /> */}
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid className={classes.summary}>
          <Paper align="center">
            <List>
              {props.cartItems.map((item) => (
                <ListItem key={item.id}>
                  <Avatar
                    src={item.thumbnail}
                    size="large"
                    className={classes.summaryItem}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={item.author ? item.author : null}
                  />
                  <Typography
                    variant="subtitle1"
                    component="span"
                    className={classes.summaryItem}
                    edge="end"
                  >
                    {Number(item.credit).toFixed(1) + " credits"}
                  </Typography>
                </ListItem>
              ))}
              <hr />
              <ListItem key={-1}>
                <Typography variant="h6" component="p">
                  Total Credits: {Number(props.totalCredits).toFixed(1)}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Checkout;
