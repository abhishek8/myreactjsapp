import React, { useEffect, useState } from "react";
import CourseService from "../services/courseService";
import ReviewPreview from "./shared/ReviewPreview";

import { Typography, Grid, Snackbar, TablePagination } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Loading from "./shared/Loading";

function ReviewCourses(props) {
  const [courses, setCourses] = useState([]);
  const [rejectedCourses, setRejectedCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);

  const [approvedPage, setApprovedPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [reviewSuccess, setreviewSuccess] = useState(false);
  const [reviewFail, setreviewFail] = useState(false);

  useEffect(() => {
    let service = new CourseService();

    service.getUnverifiedCourses().then((res) => {
      if (res) setCourses(res);
    });
    service.getVerifiedCoursesForReviewer(false).then((res) => {
      if (res) setRejectedCourses(res);
    });
    service.getVerifiedCoursesForReviewer(true).then((res) => {
      if (res) setApprovedCourses(res);
    });
  }, []);

  const verifyCourse = async (courseId, status) => {
    let service = new CourseService();
    setLoading(true);
    let res = await service.verifyCourse(courseId, status);

    if (res) {
      setCourses(courses.filter((course) => course._id !== courseId));

      let allCourses = [...courses, ...approvedCourses, ...rejectedCourses];
      let courseMatch = allCourses.find((course) => course._id === courseId);
      console.log(courseMatch);
      if (status) {
        setApprovedCourses([...approvedCourses, courseMatch]);
        setRejectedCourses(
          rejectedCourses.filter((course) => course._id !== courseId)
        );
      } else {
        setApprovedCourses(
          approvedCourses.filter((course) => course._id !== courseId)
        );
        setRejectedCourses([...rejectedCourses, courseMatch]);
      }
      setreviewSuccess(true);
    } else setreviewFail(true);

    setLoading(false);
  };

  return (
    <div>
      <br />
      <Loading open={loading} />
      {courses && (
        <>
          <Typography variant="h6" component="h4">
            {courses.length > 0
              ? "Pending Courses"
              : "No courses are pending to be reviewed."}
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
          <br />
        </>
      )}

      {rejectedCourses && (
        <>
          <Typography variant="h6" component="h4">
            {rejectedCourses.length > 0
              ? "Rejected Courses"
              : "No courses rejected till now."}
          </Typography>
          <br />
          <Grid container spacing={3}>
            {rejectedCourses.map((course) => (
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
      {approvedCourses && (
        <>
          <Typography variant="h6" component="h4">
            {approvedCourses.length > 0
              ? "Approved Courses"
              : "No courses are approved till now."}
          </Typography>
          <br />
          <Grid container spacing={3}>
            {approvedCourses
              .slice(
                approvedPage * 4,
                approvedPage * 4 + 4 > approvedCourses.length
                  ? approvedCourses.length
                  : approvedPage * 4 + 4
              )
              .map((course) => (
                <ReviewPreview
                  key={course._id}
                  course={course}
                  verifyCourse={verifyCourse}
                  {...props}
                />
              ))}
          </Grid>
          <TablePagination
            component="div"
            count={approvedCourses.length}
            page={approvedPage}
            rowsPerPage={4}
            rowsPerPageOptions={[4]}
            onChangePage={(e, page) => setApprovedPage(page)}
          ></TablePagination>
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

export default ReviewCourses;
