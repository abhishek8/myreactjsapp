import React, { useState, useEffect } from "react";
import AppUtils from "../utilities/AppUtils";
import { AppDefault } from "../config";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@material-ui/core";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import Alert from "@material-ui/lab/Alert";
import UserService from "../services/userService";
import CourseService from "../services/courseService";
//import CoursePreview from "./shared/CoursePreview";
import BackButton from "./shared/BackButton";
import Rating from "@material-ui/lab/Rating";

function Profile(props) {
  const [profileInfo, setProfileInfo] = useState({
    username: "Something went wrong!",
    profileImg: AppDefault.noImage,
    role: "unknown",
    email: "",
    balance: 0,
  });
  const [watched, setWatched] = useState([]);

  const [pickCourse, setPickCourse] = useState(null);
  const [rating, setRating] = useState(5);
  const [askRating, setAskRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingFailure, setRatingFailure] = useState(false);

  const getCourseList = async (courseIds) => {
    const service = new CourseService();
    let courseList = [];

    if (courseIds && courseIds.length > 0) {
      for (let i = 0; i < courseIds.length; i++) {
        let response = await service.getCourseById(courseIds[i]);
        console.log(response);
        if (response) {
          let rateRes = await service.getUserRating(courseIds[i]);
          console.log("Rate", rateRes);
          rateRes = rateRes ? rateRes : 0;
          response["rating"] = rateRes;
          courseList.push(response);
        }
      }
    }
    console.log(courseList);
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

  const handleRating = (courseId) => {
    setAskRating(true);
    setPickCourse(courseId);
  };

  const postRating = () => {
    let service = new CourseService();
    const data = {
      courseId: pickCourse,
      rating_value: rating,
    };
    service
      .postRating(data)
      .then((res) => {
        if (res.success) setRatingSuccess(true);
        else setRatingFailure(true);
      })
      .catch((err) => setRatingFailure(true));
    setAskRating(false);
  };

  return (
    <div className="">
      <BackButton />
      <br />
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
            <Grid item xs={12} sm={12} md={9}>
              {watched && watched.length > 0 && (
                <List>
                  {watched.map((course) => (
                    <ListItem key={course._id}>
                      <Avatar
                        src={course.thumbnail}
                        size="large"
                        style={{ margin: "16px" }}
                      />
                      <ListItemText
                        primary={course.title}
                        secondary={
                          course.author.name ? course.author.name : null
                        }
                      />
                      {(!course.rating || course.rating === 0) && (
                        <Button
                          type="button"
                          variant="contained"
                          color="default"
                          onClick={(e) => handleRating(course._id)}
                        >
                          Provied Rating
                        </Button>
                      )}
                      {course.rating > 0 && (
                        <Rating
                          name="rating"
                          value={course.rating}
                          size="medium"
                          min={1}
                          max={5}
                          readOnly
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
          <Dialog open={askRating} onClose={() => setAskRating(false)}>
            <DialogTitle>Please provide your rating</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This is necessary to gain credits if any offered in this course
              </DialogContentText>
              <Rating
                name="courseRating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                size="medium"
                min={1}
                max={5}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={postRating} color="primary" autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={ratingSuccess}
            autoHideDuration={6000}
            onClose={() => setRatingSuccess(false)}
          >
            <Alert severity="success">
              Successfully submitted your rating. You will recieve credit in
              your account if course had offered.
            </Alert>
          </Snackbar>
          <Snackbar
            open={ratingFailure}
            autoHideDuration={6000}
            onClose={() => setRatingFailure(false)}
          >
            <Alert severity="error">
              Failed to submit your rating. Please try again!
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default Profile;
