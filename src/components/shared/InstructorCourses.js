import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CourseService from "../../services/courseService";
import AppUtils from "../../utilities/AppUtils";
import MyCoursePreview from "./MyCoursePreview";

import { Grid, Typography, TablePagination, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Loading from "./Loading";
import SearchComponent from "./SearchComponent";

function InstructorCourses(props) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFail, setDeleteFail] = useState(false);
  const [deactivateSuccess, setDeactivateSuccess] = useState(false);
  const [deactivateFail, setDeactivateFail] = useState(false);

  const history = useHistory();

  let courseService = new CourseService();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleClick = (courseId, status) => {
    if (status === "CREATED") history.push(`/course/content/${courseId}`);
    else history.push(`/video/${courseId}`);
  };

  const handleEdit = (courseId, status) => {
    if (status !== "COMPLETED") history.push(`/course/edit/${courseId}`);
  };

  const removeCourse = (courseId) => {
    setLoading(true);
    courseService
      .deleteCourse(courseId)
      .then((res) => {
        setLoading(false);
        if (res) {
          props.courses.filter((c) => c._id !== res._id);
          props.setCourses(props.courses);
          setDeleteSuccess(true);
        } else setDeleteFail(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setDeleteFail(true);
      });
  };

  const deactivateCourse = (courseId) => {
    setLoading(true);
    courseService
      .deactivateCourse(courseId)
      .then((res) => {
        setLoading(false);
        if (res && res.success) {
          let courseList = props.courses.filter((c) => c._id !== res.id);
          courseList = courseList ? courseList : [];
          console.log(courseList);
          props.setCourses(courseList);
          setDeactivateSuccess(true);
        } else setDeactivateFail(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setDeactivateFail(true);
      });
  };

  const filteredCourses = (searchVal) => {
    return props.courses.filter((course) =>
      course.title.toLowerCase().includes(searchVal.toLowerCase())
    );
  };

  return (
    <>
      <Loading open={loading} />
      {props.courses.length > 0 && (
        <>
          <Typography variant="h6" component="h4" paragraph>
            {AppUtils.capitalize(props.label)}
          </Typography>
          <SearchComponent
            value={search}
            onChange={handleSearch}
            onSearch={handleSearch}
          />
          <Grid container spacing={4}>
            {filteredCourses(search)
              .slice(
                page * 4,
                page * 4 + 4 > props.courses.length
                  ? props.courses.length
                  : page * 4 + 4
              )
              .map((course) => (
                <MyCoursePreview
                  key={course._id}
                  course={course}
                  handleEdit={() => handleEdit(course._id, course.status)}
                  handleClick={() => handleClick(course._id, course.status)}
                  handleRemove={removeCourse}
                  handleDeactivate={deactivateCourse}
                />
              ))}
          </Grid>
          {filteredCourses(search).length > 0 && (
            <TablePagination
              component="div"
              count={filteredCourses(search).length}
              page={page}
              rowsPerPage={4}
              rowsPerPageOptions={[4]}
              onChangePage={handlePageChange}
            />
          )}
        </>
      )}
      {filteredCourses(search).length === 0 && (
        <Typography variant="subtitle1" color="secondary" component="h6">
          {`No ${props.label} courses available.`}
        </Typography>
      )}
      <br />
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={6000}
        onClose={() => setDeleteSuccess(false)}
      >
        <Alert severity="success">Course successfully deleted.</Alert>
      </Snackbar>
      <Snackbar
        open={deleteFail}
        autoHideDuration={6000}
        onClose={() => setDeleteFail(false)}
      >
        <Alert severity="error">
          Failed to delete this course. Please try again!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deactivateSuccess}
        autoHideDuration={6000}
        onClose={() => setDeactivateSuccess(false)}
      >
        <Alert severity="success">Course successfully deactivated.</Alert>
      </Snackbar>
      <Snackbar
        open={deactivateFail}
        autoHideDuration={6000}
        onClose={() => setDeactivateFail(false)}
      >
        <Alert severity="error">
          Failed to deactivate this course. Please try again!
        </Alert>
      </Snackbar>
    </>
  );
}

export default InstructorCourses;
