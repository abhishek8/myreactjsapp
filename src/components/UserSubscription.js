import React, { useState, useEffect } from "react";
import CoursePreview from "./shared/CoursePreview";
import CourseService from "../services/courseService";

import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

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
      <br />
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

// export class UserSubscription extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       courses: [],
//     };

//     this.handleClick = this.handleClick.bind(this);
//   }

//   async componentDidMount() {
//     let serviceObj = new CourseService();
//     let courseList = await serviceObj.getPurchasedCourse();
//     if (courseList && courseList.length > 0) {
//       this.setState({
//         courses: courseList,
//       });
//     }
//   }

//   filterCourses(courses) {
//     return courses;
//   }

//   handleClick(courseId) {
//     this.props.history.push(`/video/${courseId}`);
//   }

//   render() {
//     let filteredCourses = this.filterCourses(this.state.courses);
//     let heading = "You have not purchased any course till now.";
//     if (filteredCourses && filteredCourses.length > 0) {
//       heading = "My Courses";
//     }
//     const cardList = filteredCourses.map((course) => {
//       return (
//         <CoursePreview
//           key={course._id}
//           course={course}
//           handleClick={() => this.handleClick(course._id)}
//           {...this.props}
//         />
//       );
//     });

//     return (
//       <div>
//         <br />
//         <Typography variant="h6" component="h4">
//           {heading}
//         </Typography>
//         <br />
//         <Grid container spacing={4}>
//           {cardList}
//         </Grid>
//       </div>
//     );
//   }
// }

// export default UserSubscription;
