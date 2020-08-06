import React from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";

function Loading(props) {
  return (
    <Backdrop open={props.open} style={{ zIndex: 34002 }}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}

export default Loading;
