import React, { Component } from "react";
import CoursePreview from "./shared/CoursePreview";
import CourseService from "../services/courseService";

import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

export class UserSubscription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
    };

    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    let serviceObj = new CourseService();
    let courseList = await serviceObj.getPurchasedCourse();
    if (courseList && courseList.length > 0) {
      this.setState({
        courses: courseList,
      });
    }
  }

  filterCourses(courses) {
    return courses;
  }

  handleClick(courseId) {
    this.props.history.push(`/video/${courseId}`);
  }

  render() {
    let filteredCourses = this.filterCourses(this.state.courses);
    let heading = "You have not purchased any course till now.";
    if (filteredCourses && filteredCourses.length > 0) {
      heading = "My Courses";
    }
    const cardList = filteredCourses.map((course) => {
      return (
        <CoursePreview
          key={course._id}
          course={course}
          handleClick={() => this.handleClick(course._id)}
          {...this.props}
        />
      );
    });

    return (
      <div>
        <br />
        <Typography variant="h6" component="h4">
          {heading}
        </Typography>
        <br />
        <Grid container spacing={4}>
          {cardList}
        </Grid>
      </div>
    );
  }
}

export default UserSubscription;
