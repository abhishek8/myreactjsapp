import React from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";

function Loading() {
  return (
    <Backdrop open={true} style={{ zIndex: 34002 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}

export default Loading;
