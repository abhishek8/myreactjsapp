import React, { useEffect, useState } from "react";
import CourseService from "../services/courseService";
import ReviewPreview from "./shared/ReviewPreview";

import { Typography, Grid, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Loading from "./shared/Loading";

function ReviewCourses(props) {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [reviewSuccess, setreviewSuccess] = useState(false);
  const [reviewFail, setreviewFail] = useState(false);

  useEffect(() => {
    let service = new CourseService();
    let params = `verified=false`;
    service.getAllCourses(params).then((res) => {
      if (res) setCourses(res);
    });
  }, []);

  const verifyCourse = async (courseId, status) => {
    let service = new CourseService();
    setLoading(true);
    let res = await service.verifyCourse(courseId, status);
    setLoading(false);
    if (res) {
      if (status) {
        setCourses(courses.filter((course) => course._id !== courseId));
      }
      setreviewSuccess(true);
    } else setreviewFail(true);
  };

  return (
    <div>
      <br />
      <Loading open={loading} />
      <Typography variant="h6" component="h4">
        {courses.length > 0
          ? "Pending Courses"
          : "No courses are pending to be reviewd. Come back later."}
      </Typography>
      <br />
      <Grid container spacing={3}>
        {courses.map((course) => (
          <ReviewPreview
            key={course._id}
            course={course}
            verifyCourse={verifyCourse}
            {...props}
          />
        ))}
      </Grid>
      <Snackbar
        open={reviewSuccess}
        autoHideDuration={6000}
        onClose={() => setreviewSuccess(false)}
      >
        <Alert severity="success">
          Your review has been successfully submitted.
        </Alert>
      </Snackbar>
      <Snackbar
        open={reviewFail}
        autoHideDuration={6000}
        onClose={() => setreviewFail(false)}
      >
        <Alert severity="error">
          Failed to submit your review. Please try again!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ReviewCourses;
