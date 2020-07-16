import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

class Footer extends React.Component {
  render() {
    return (
      <footer className="container footer">
        <h2>&nbsp;</h2>
        <div className="row">
          <div className="col">
            <Typography variant="body2" color="textSecondary">
              <Link color="inherit" href="https://www.persistent.com">
                {"Copyright © "} Persistent Systems, {new Date().getFullYear()}
              </Link>{" "}
            </Typography>
          </div>
          <div className="col">
            <Typography variant="body2" color="textSecondary" align="right">
              <Link
                align="right"
                color="inherit"
                href="https://www.persistent.com/privacy-notice/"
              >
                Privacy Notice
              </Link>
              {" | "}
              <Link
                color="inherit"
                href="https://www.persistent.com/cookie-policy/"
              >
                Cookie Policy
              </Link>
              {" | "}
              <Link color="inherit" href="">
                Best supported on
              </Link>
            </Typography>
          </div>
        </div>
        <h2>&nbsp;</h2>
        {/* <span className="">© 2020 Copyright. Persistent Systems</span>
        <span className="ml-auto">
          <a href="https://www.persistent.com/privacy-notice/">
            Privacy Notice |{" "}
          </a>
          <a href="https://www.persistent.com/cookie-policy/">
            Cookie Policy |{" "}
          </a>
          <a href="#">Best supported on | </a>
          <a href="https://www.persistent.com">persistent.com</a>
        </span> */}
      </footer>
    );
  }
}

export default Footer;
