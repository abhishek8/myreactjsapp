import React, { useState, useEffect } from "react";
//import AppUtils from "../utilities/AppUtils";
import CourseService from "../services/courseService";
import UserService from "../services/userService";
import CoursePreview from "./shared/CoursePreview";

import Typography from "@material-ui/core/Typography";

function BrowseCourses(props) {
  const [courses, setCourses] = useState([]);
  //const [cart, setCart] = useState([]);

  const { params } = props.match;

  useEffect(() => {
    let fetchData = async () => {
      let service = new CourseService();
      let courseList = await service.getAllCourses(`genre=${params.id}`);
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
      //let cart = JSON.parse(sessionStorage.getItem("app_cart"));
      if (courseList.length > 0) {
        setCourses(courseList);
        //setCart(cart ? cart : []);
      }
    };

    fetchData();
  }, [params]);

  // const filterCourses = (courses) => {
  //   let { search } = props.location;
  //   const result = AppUtils.getQueryParamValue("filterBy", search);
  //   if (result && result !== "") {
  //     return courses.filter(
  //       (c) =>
  //         c.title.toLowerCase().includes(result.toLowerCase()) ||
  //         c.description.toLowerCase().includes(result.toLowerCase())
  //     );
  //   }
  //   return courses;
  // };

  // const addToCart = (courseId) => {
  //   let cart = JSON.parse(sessionStorage.getItem("app_cart"));
  //   cart = cart ? cart : [];
  //   cart.push(courseId);
  //   sessionStorage.setItem("app_cart", cart);
  //   setCart(cart);
  // };

  return (
    <div>
      <br />
      <Typography variant="h6" component="h4">
        {courses.length > 0
          ? "Most popular"
          : "No courses available. Check back later."}
      </Typography>
      <br />
      {courses.map((course) => (
        <CoursePreview
          key={course._id}
          course={course}
          checkForCart={true}
          {...props}
        />
      ))}
    </div>
  );
}

export default BrowseCourses;

// class BrowseCourses extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       courses: [],
//       cart: [],
//     };
//   }

//   async componentDidMount() {
//     let { params } = this.props.match;
//     let serviceObj = new CourseService();
//     let courseList = await serviceObj.getAllCourses(`genre=${params.id}`);
//     let userService = new UserService();
//     let userInfo = await userService.fetchUserDetails();
//     const subs =
//       userInfo.role === "user" && userInfo.subscriptions
//         ? userInfo.subscriptions
//         : [];
//     courseList = courseList
//       ? courseList.filter((course) => !subs.includes(course._id))
//       : [];
//     let cart = sessionStorage.getItem("app_cart");
//     if (courseList.length > 0) {
//       this.setState({
//         courses: courseList,
//         cart: cart ? cart : [],
//       });
//     }
//   }

//   filterCourses(courses) {
//     let { search } = this.props.location;
//     const result = AppUtils.getQueryParamValue("filterBy", search);
//     if (result && result !== "") {
//       return courses.filter(
//         (c) =>
//           c.title.toLowerCase().includes(result.toLowerCase()) ||
//           c.description.toLowerCase().includes(result.toLowerCase())
//       );
//     }
//     return courses;
//   }

//   addToCart(courseId) {
//     let cart = sessionStorage.getItem("app_cart");
//     cart = cart ? cart : [];
//     cart.push(courseId);
//     sessionStorage.setItem("app_cart", cart);
//     this.setState({
//       cart: cart,
//     });
//   }

//   render() {
//     let filteredCourses = this.filterCourses(this.state.courses);
//     let heading = "No courses available. Check back later.";
//     if (filteredCourses && filteredCourses.length > 0) {
//       heading = "Most popular";
//     }
//     const cardList = filteredCourses.map((course) => {
//       return (
//         <CoursePreview
//           key={course._id}
//           course={course}
//           checkForCart={true}
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
//         <ListComponent cardList={cardList}></ListComponent>
//       </div>
//     );
//   }
// }

// export default BrowseCourses;
