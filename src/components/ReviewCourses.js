import React, { useEffect, useState } from "react";
import CourseService from "../services/courseService";
import CoursePreview from "./shared/CoursePreview";

import { Typography, Grid } from "@material-ui/core";

function ReviewCourses(props) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let service = new CourseService();
    let params = `verified=false`;
    service.getAllCourses(params).then((res) => {
      if (res) setCourses(res);
    });
  }, []);

  const verifyCourse = async (courseId, status) => {
    let service = new CourseService();
    let res = await service.verifyCourse(courseId, status);
    if (res) {
      if (status) {
        setCourses(courses.filter((course) => course._id !== courseId));
      }
      alert("Successful");
    } else alert("Unsuccessful");
  };

  return (
    <div>
      <br />
      <Typography variant="h6" component="h4">
        {courses.length > 0
          ? "Pending Courses"
          : "No courses are pending to be reviewd. Come back later."}
      </Typography>
      <br />
      <Grid container spacing={4}>
        {courses.map((course) => (
          <CoursePreview
            key={course._id}
            course={course}
            isReviewer={true}
            handleClick={() => props.history.push(`/video/${course._id}`)}
            handleAccept={() => verifyCourse(course._id, true)}
            handleReject={() => verifyCourse(course._id, false)}
            {...props}
          />
        ))}
      </Grid>
    </div>
  );
}

export default ReviewCourses;
