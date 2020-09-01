import React from "react";
import { useHistory } from "react-router-dom";
import { Link, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  customStyle: {
    margin: theme.spacing(2),
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

function BackButton() {
  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={classes.customStyle}>
      <Link
        component="a"
        color="primary"
        underline="hover"
        variant="body2"
        onClick={() => history.goBack()}
      >
        <ArrowBackIcon />
        &nbsp;Back
      </Link>
    </div>
  );
}

export default BackButton;
