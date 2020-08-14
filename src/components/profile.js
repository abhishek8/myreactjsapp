import React, { useState, useEffect } from "react";
import AppUtils from "../utilities/AppUtils";
import { AppDefault } from "../config";
import { Grid, Typography } from "@material-ui/core";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import UserService from "../services/userService";
import CourseService from "../services/courseService";
import CoursePreview from "./shared/CoursePreview";

function Profile(props) {
  const [profileInfo, setProfileInfo] = useState({
    username: "Something went wrong!",
    profileImg: AppDefault.noImage,
    role: "unknown",
    email: "",
    balance: 0,
  });
  const [watched, setWatched] = useState([]);

  const getCourseList = async (courseIds) => {
    const service = new CourseService();
    let courseList = [];

    if (courseIds && courseIds.length > 0) {
      for (let i = 0; i < courseIds.length; i++) {
        let response = await service.getCourseById(courseIds[i]);
        if (response) courseList.push(response);
      }
    }

    return courseList;
  };

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
        if (userData.role === "user" && userData.history) {
          getCourseList(userData.history["watched"]).then((res) =>
            setWatched(res)
          );
        }
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
      <br />
      <br />
      {watched && watched.length > 0 && (
        <>
          <Typography variant="h6" component="h4">
            Watched
          </Typography>
          <br />
          <Grid container spacing={4}>
            {watched.map((course) => (
              <CoursePreview
                key={course._id}
                course={course}
                handleClick={() => props.history.push(`/video/${course._id}`)}
                purchased={true}
              />
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}

export default Profile;
