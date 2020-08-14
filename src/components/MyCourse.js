import React, { useState, useEffect } from "react";
import MyCoursePreview from "./shared/MyCoursePreview";
import Loading from "./shared/Loading";
import CourseService from "../services/courseService";

import {
  Grid,
  Button,
  Typography,
  Snackbar,
  TablePagination,
} from "@material-ui/core";
import CreateSharpIcon from "@material-ui/icons/CreateSharp";
import Alert from "@material-ui/lab/Alert";

function MyCourse(props) {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);

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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
        {courses
          .slice(
            page * 4,
            page * 4 + 4 > courses.length ? courses.length : page * 4 + 4
          )
          .map((course) => (
            <MyCoursePreview
              key={course._id}
              course={course}
              handleEdit={() =>
                props.history.push(`/course/edit/${course._id}`)
              }
              handleRemove={removeCourse}
              handleClick={() => props.history.push(`/video/${course._id}`)}
            />
          ))}
      </Grid>
      <TablePagination
        component="div"
        count={courses.length}
        page={page}
        rowsPerPage={4}
        rowsPerPageOptions={[4]}
        onChangePage={handlePageChange}
      ></TablePagination>
      <Loading open={loading} />
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
