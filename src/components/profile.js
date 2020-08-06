import React, { useState, useEffect } from "react";
import AppUtils from "../utilities/AppUtils";
import { AppDefault } from "../config";
import { Grid, Typography } from "@material-ui/core";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import UserService from "../services/userService";

function Profile(props) {
  const [profileInfo, setProfileInfo] = useState({
    username: "Something went wrong!",
    profileImg: AppDefault.noImage,
    role: "unknown",
    email: "",
    balance: 0,
  });

  useEffect(() => {
    const service = new UserService();
    service.fetchUserDetails().then((userData) => {
      if (userData) {
        let picUrl = userData.profileImage;
        setProfileInfo({
          username: AppUtils.capitalize(userData.name),
          profileImg: picUrl ? picUrl : AppDefault.noImage,
          email: userData.email,
          role: AppUtils.capitalize(userData.role),
          balance: userData.creditBalance,
        });
      }
    });
    console.log("UseEffect - Profile");
  }, []);

  return (
    <div className="">
      <h1>&nbsp;</h1>
      <Grid container>
        <Grid item>
          <img src={profileInfo.profileImg} alt="" height="150" width="150" />
        </Grid>
        <Grid item style={{ margin: "16px" }}>
          <Typography variant="h3" component="h3">
            {profileInfo.username}
          </Typography>
          <Typography variant="h5" component="h5">
            <EmailRoundedIcon /> {profileInfo.email}
          </Typography>
          <Typography variant="h6" component="h6">
            <VerifiedUserIcon /> {profileInfo.role}
          </Typography>
          {profileInfo.role === "User" && (
            <Typography variant="h6" component="h6">
              <AccountBalanceIcon /> {profileInfo.balance} Credits
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Profile;
