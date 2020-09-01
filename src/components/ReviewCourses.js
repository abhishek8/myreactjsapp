import React, { useEffect, useState } from "react";
import CourseService from "../services/courseService";

import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Loading from "./shared/Loading";
import ReviewerCourses from "./shared/ReviewerCourses";

function ReviewCourses(props) {
  const [rejectedCourses, setRejectedCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [reviewSuccess, setreviewSuccess] = useState(false);
  const [reviewFail, setreviewFail] = useState(false);

  useEffect(() => {
    let service = new CourseService();
    console.log("useEffect");

    service.getVerifiedCoursesForReviewer().then((res) => {
      if (res && res.length > 0) {
        res.forEach((course) => {
          if (course.status === "REJECTED")
            setRejectedCourses((prev) => [...prev, course]);
          else if (
            course.status === "ACTIVE" ||
            course.status === "DEACTIVATED"
          )
            setApprovedCourses((prev) => [...prev, course]);
        });
      }
    });
  }, []);

  const verifyCourse = async (courseId, status) => {
    let service = new CourseService();
    setLoading(true);
    let res = await service.verifyCourse(courseId, status);

    if (res) {
      let allCourses = [...approvedCourses, ...rejectedCourses];
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
      <ReviewerCourses
        label="rejected"
        courses={rejectedCourses}
        verifyCourse={verifyCourse}
      />
      <ReviewerCourses
        label="approved"
        courses={approvedCourses}
        verifyCourse={verifyCourse}
      />

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
