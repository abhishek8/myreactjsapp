import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AppUtils from "../../utilities/AppUtils";

import { Grid, Typography, TablePagination } from "@material-ui/core";
import SearchComponent from "./SearchComponent";
import ReviewPreview from "./ReviewPreview";

function ReviewerCourses(props) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const history = useHistory();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = (courseId) => {
    history.push(`/video/${courseId}`);
  };

  const filteredCourses = (searchVal, courses) => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchVal.toLowerCase())
    );
  };

  return (
    <>
      <Typography variant="h6" component="h4">
        {AppUtils.capitalize(props.label)}
      </Typography>
      <SearchComponent
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={() => setSearch(search)}
      />
      {props.courses && (
        <>
          <Grid container spacing={4}>
            {filteredCourses(search, props.courses)
              .slice(
                page * 4,
                page * 4 + 4 > props.courses.length
                  ? props.courses.length
                  : page * 4 + 4
              )
              .map((course) => (
                <ReviewPreview
                  key={course._id}
                  course={course}
                  onClick={handleClick}
                  verifyCourse={props.verifyCourse}
                  hideDelete={course.status === "REJECTED"}
                  hideApprove={
                    course.status !== "COMPLETED" &&
                    course.status !== "REJECTED"
                  }
                />
              ))}
          </Grid>
          {filteredCourses(search, props.courses).length > 0 && (
            <TablePagination
              component="div"
              count={filteredCourses(search, props.courses).length}
              page={page}
              rowsPerPage={4}
              rowsPerPageOptions={[4]}
              onChangePage={handlePageChange}
            />
          )}
          {filteredCourses(search, props.courses).length === 0 && (
            <Typography variant="subtitle1" color="secondary" component="h6">
              {`No ${props.label} courses available.`}
            </Typography>
          )}
        </>
      )}

      <br />
    </>
  );
}

export default ReviewerCourses;
