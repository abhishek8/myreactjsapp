import React, { useState, useEffect } from "react";
import CoursePreview from "./shared/CoursePreview";
import CourseService from "../services/courseService";

import { Grid, Button, Typography } from "@material-ui/core";
import CreateSharpIcon from "@material-ui/icons/CreateSharp";

function MyCourse(props) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const courseService = new CourseService();
      const result = await courseService.getCourseForTrainer();
      console.log(result);
      if (result) setCourses(result);
    };

    fetchData();
  }, []);

  const removeCourse = (course) => {
    let courseService = new CourseService();
    courseService
      .deleteCourse(course._id)
      .then((res) => {
        if (res) {
          let courseList = courses.filter((c) => c._id !== res._id);
          setCourses(courseList);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <br />
      <div>
        <Button
          variant="contained"
          color="primary"
          className="mb-3"
          onClick={() => props.history.push("/course/create")}
        >
          <CreateSharpIcon /> Create Course
        </Button>
      </div>
      <Typography variant="h6" component="h4">
        {courses.length > 0
          ? "My Courses"
          : "You have not created any course till now."}
      </Typography>
      <br />

      <Grid container spacing={4}>
        {courses.map((course) => (
          <CoursePreview
            key={course._id}
            course={course}
            isAuthor={true}
            handleEdit={() =>
              props.history.push(`/course/create/${course._id}`)
            }
            handleRemove={() => removeCourse(course._id)}
            handleClick={() => props.history.push(`/video/${course._id}`)}
            {...props}
          />
        ))}
      </Grid>
    </div>
  );
}

export default MyCourse;

// import React, { Component } from "react";
// import VideoPreview from "./shared/VideoPreview";
// import CourseService from "../services/courseService";

// export class MyCourse extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       courseList: [],
//     };
//     this.removeCourse = this.removeCourse.bind(this);
//   }

//   async componentDidMount() {
//     let service = new CourseService();
//     let courseList = await service.getCourseForTrainer();
//     this.setState({
//       courseList: courseList,
//     });
//   }

//   removeCourse(course) {
//     let service = new CourseService();
//     service
//       .deleteCourse(course._id)
//       .then((res) => {
//         if (res) {
//           let courseList = this.state.courseList.filter(
//             (c) => c._id !== res._id
//           );
//           this.setState({
//             courseList: courseList,
//           });
//         }
//       })
//       .catch((err) => console.log(err));
//   }

//   render() {
//     return (
//       <div>
//         <button
//           onClick={() => this.props.history.push("/course/create")}
//           className="btn btn-secondary"
//         >
//           Create
//         </button>
//         <div>
//           <VideoPreview
//             courseList={this.state.courseList}
//             removeCourse={this.removeCourse}
//             {...this.props}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default MyCourse;
