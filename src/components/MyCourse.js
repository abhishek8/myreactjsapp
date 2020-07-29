import React, { useState, useEffect } from "react";
import MyCoursePreview from "./shared/MyCoursePreview";
import Loading from "./shared/Loading";
import CourseService from "../services/courseService";

import { Grid, Button, Typography, Snackbar } from "@material-ui/core";
import CreateSharpIcon from "@material-ui/icons/CreateSharp";
import Alert from "@material-ui/lab/Alert";

function MyCourse(props) {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setdeleteSuccess] = useState(false);
  const [deleteFail, setdeleteFail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const courseService = new CourseService();
      const result = await courseService.getCourseForTrainer();
      console.log(result);
      if (result) setCourses(result);
    };

    fetchData();
  }, []);

  const removeCourse = (courseId) => {
    let courseService = new CourseService();
    setLoading(true);
    courseService
      .deleteCourse(courseId)
      .then((res) => {
        setLoading(false);
        if (res) {
          let courseList = courses.filter((c) => c._id !== res._id);
          setCourses(courseList);
          setdeleteSuccess(true);
        } else setdeleteFail(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setdeleteFail(true);
      });
  };

  return (
    <div>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.history.push("/course/new")}
      >
        <CreateSharpIcon /> Create Course
      </Button>
      <br />
      <br />
      <Typography variant="h6" component="h4">
        {courses.length > 0
          ? "My Courses"
          : "You have not created any course till now."}
      </Typography>
      <br />

      <Grid container spacing={4}>
        {courses.map((course) => (
          <MyCoursePreview
            key={course._id}
            course={course}
            handleEdit={() =>
              props.history.push(`/course/create/${course._id}`)
            }
            handleRemove={removeCourse}
            handleClick={() => props.history.push(`/video/${course._id}`)}
          />
        ))}
      </Grid>
      {loading && <Loading />}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={6000}
        onClose={() => setdeleteSuccess(false)}
      >
        <Alert severity="success">Course successfully deleted.</Alert>
      </Snackbar>
      <Snackbar
        open={deleteFail}
        autoHideDuration={6000}
        onClose={() => setdeleteFail(false)}
      >
        <Alert severity="error">
          Failed to delete this course. Please try again!
        </Alert>
      </Snackbar>
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
