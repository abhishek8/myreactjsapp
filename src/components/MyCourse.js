import React, { useState, useEffect } from "react";
import Loading from "./shared/Loading";
import CourseService from "../services/courseService";

// import { Button } from "@material-ui/core";
// import CreateSharpIcon from "@material-ui/icons/CreateSharp";
import InstructorCourses from "./shared/InstructorCourses";

function MyCourse() {
  // const [created, setCreatedCourses] = useState([]);
  // const [pending, setPendingCourses] = useState([]);
  //const [rejected, setRejectedCourses] = useState([]);
  const [active, setActiveCourses] = useState([]);
  const [deactive, setDeactiveCourses] = useState([]);

  const [loading, setLoading] = useState(false);

  const loadCourses = (courses) => {
    // const createdCourses = [];
    // const pendingCourses = [];
    // const rejectedCourses = [];
    const activeCourses = [];
    const deactiveCourses = [];

    courses.forEach((course) => {
      switch (course.status) {
        case "CREATED":
        case "COMPLETED":
        case "REJECTED":
          break;
        case "ACTIVE":
          activeCourses.push(course);
          break;
        case "DEACTIVATED":
          deactiveCourses.push(course);
          break;
        default:
          console.log(course);
      }
    });
    // setCreatedCourses(createdCourses);
    // setPendingCourses(pendingCourses);
    // setRejectedCourses(rejectedCourses);
    setActiveCourses(activeCourses);
    setDeactiveCourses(deactiveCourses);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const courseService = new CourseService();
      const result = await courseService.getCourseForTrainer();
      console.log(result);
      if (result) loadCourses(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Loading open={loading} />
      {/* <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.history.push("/course/add")}
      >
        <CreateSharpIcon />
        &nbsp;Create Course
      </Button> */}
      <br />
      <br />
      {/* <InstructorCourses
        courses={created}
        setCourses={setCreatedCourses}
        label="created"
      />
      <InstructorCourses
        courses={pending}
        setCourses={setPendingCourses}
        label="pending"
      />
      <InstructorCourses
        courses={rejected}
        setCourses={setRejectedCourses}
        label="rejected"
      /> */}
      <InstructorCourses
        courses={active}
        setCourses={setActiveCourses}
        label="active"
      />
      <InstructorCourses
        courses={deactive}
        setCourses={setDeactiveCourses}
        label="deactive"
      />
    </div>
  );
}

export default MyCourse;
