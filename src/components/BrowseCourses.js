import React, { useState, useEffect, useContext } from "react";
import CourseService from "../services/courseService";
import UserService from "../services/userService";
import CoursePreview from "./shared/CoursePreview";

import { Grid, Typography } from "@material-ui/core";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

function BrowseCourses(props) {
  const [courses, setCourses] = useState([]);

  const userContext = useContext(UserContext);
  const cartContext = useContext(CartContext);

  const { params } = props.match;

  useEffect(() => {
    let fetchData = async () => {
      console.log("UseEffect - BrowseCourse");
      let service = new CourseService();
      let courseList = await service.getAllCourses(`genre=${params.id}`);
      if (userContext.userState.isAuthenticated) {
        let userService = new UserService();
        let userInfo = await userService.fetchUserDetails();
        const subs =
          userInfo.role === "user" &&
          userInfo.subscriptions &&
          userInfo.subscriptions.length > 0
            ? userInfo.subscriptions
            : [];
        courseList = courseList
          ? courseList.filter((course) => !subs.includes(course._id))
          : [];
      }

      if (courseList && courseList.length > 0) {
        setCourses(courseList);
      }
    };

    fetchData();
  }, [params, userContext]);

  return (
    <div>
      <br />
      <Typography variant="h6" component="h4">
        {courses.length > 0
          ? "Most popular"
          : "No courses available. Check back later."}
      </Typography>
      <br />
      <Grid container spacing={4}>
        {courses.map((course) => (
          <CoursePreview
            key={course._id}
            course={course}
            displayCart={true}
            addToCart={(_id) =>
              cartContext.cartDispatch({ type: "ADD", courseId: _id })
            }
            {...props}
          />
        ))}
      </Grid>
    </div>
  );
}

export default BrowseCourses;
