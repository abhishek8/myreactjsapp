import React, { useState } from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
} from "@material-ui/core";

function Footer() {
  const [openBestSupport, setBestSupport] = useState(false);

  return (
    <footer className="footer">
      <Grid container>
        <Grid item xs={6} sm={6} md={4}>
          <Typography variant="body2" color="textSecondary">
            <Link color="inherit" href="https://www.persistent.com">
              {"Copyright © "} Persistent Systems, {new Date().getFullYear()}
            </Link>{" "}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={8} align="right">
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
            <Link color="inherit" onClick={() => setBestSupport(true)}>
              Best supported on
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <Dialog open={openBestSupport} onClose={() => setBestSupport(false)}>
        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" component="span">
              Browser: IE 10 and above, Edge 40, Firefox and Chrome (last 3
              versions), Safari (Mac)
            </Typography>
            <Typography variant="subtitle1" component="span">
              Desktop Resolution: 1360*768, 1366*768, 1280*1024
            </Typography>
            <Typography variant="subtitle1" component="span">
              OS: Win 7 and above, macOS High Sierra, iOS 9 and above, Android 6
              and above
            </Typography>
            <Typography variant="subtitle1" component="span">
              Device: Android, iPhone 5S and above, iPad
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setBestSupport(false)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default Footer;
