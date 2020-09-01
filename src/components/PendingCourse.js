import React, { useEffect, useState } from "react";
import CourseService from "../services/courseService";
import ReviewPreview from "./shared/ReviewPreview";

import { Typography, Grid, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Loading from "./shared/Loading";
import SearchComponent from "./shared/SearchComponent";

function PendingCourse(props) {
  const [pendingCourses, setPendingCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewSuccess, setreviewSuccess] = useState(false);
  const [reviewFail, setreviewFail] = useState(false);

  useEffect(() => {
    let service = new CourseService();
    service.getUnverifiedCourses().then((res) => {
      if (res) setPendingCourses(res);
    });
  }, []);

  const verifyCourse = async (courseId, status) => {
    setLoading(true);

    let service = new CourseService();
    service
      .verifyCourse(courseId, status)
      .then((res) => {
        if (res) {
          setPendingCourses((prev) =>
            prev.filter((course) => course._id !== courseId)
          );
          setreviewSuccess(true);
        } else setreviewFail(true);
      })
      .catch((err) => setreviewFail(true));

    setLoading(false);
  };

  const filteredCourses = (searchVal, courses) => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchVal.toLowerCase())
    );
  };

  return (
    <div>
      <br />
      <Loading open={loading} />
      <Typography variant="h6" component="h4">
        Pending Courses
      </Typography>
      <SearchComponent
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={(e) => setSearch(e.target.value)}
      />
      {filteredCourses(search, pendingCourses) && (
        <>
          {filteredCourses(search, pendingCourses).length === 0 && (
            <Typography variant="subtitle1" color="secondary" component="h5">
              No pending courses to review.
            </Typography>
          )}
          <br />
          <Grid container spacing={3}>
            {filteredCourses(search, pendingCourses).map((course) => (
              <ReviewPreview
                key={course._id}
                course={course}
                verifyCourse={verifyCourse}
                {...props}
              />
            ))}
          </Grid>
          <br />
        </>
      )}

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

export default PendingCourse;
