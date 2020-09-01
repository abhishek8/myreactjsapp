import React, { useState, useEffect } from "react";
import CoursePreview from "./shared/CoursePreview";
import CourseService from "../services/courseService";

import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import BackButton from "./shared/BackButton";

function UserSubscription(props) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let service = new CourseService();
    service.getPurchasedCourse().then((res) => {
      if (res && res.length > 0) setCourses(res);
    });
  }, []);

  const handleClick = (courseId) => {
    props.history.push(`/video/${courseId}`);
  };

  return (
    <div>
      <BackButton />
      <Typography variant="h6" component="h4">
        {courses && courses.length > 0
          ? "My Courses"
          : "You have not purchased any course till now."}
      </Typography>
      <br />
      <Grid container spacing={4}>
        {courses.map((course) => (
          <CoursePreview
            key={course._id}
            course={course}
            handleClick={() => handleClick(course._id)}
            purchased={true}
          />
        ))}
      </Grid>
    </div>
  );
}

export default UserSubscription;
