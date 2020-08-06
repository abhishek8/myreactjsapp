import axios from "axios";
import { Server } from "../config";

export default class CourseService {
  accessToken = sessionStorage.getItem("auth_cookie");

  getAllCategories = () => {
    return axios.get(`${Server.BASE_API_URL}/categories/`).then((res) => {
      if (res && res.data && res.data.success) {
        return res.data.data;
      }
    });
  };

  getAllCourses = (params) => {
    let qs = params ? `?${params}` : "";
    return axios.get(`${Server.BASE_API_URL}/courses${qs}`).then((res) => {
      return res.data.data;
    });
  };

  getCourseById = (id) => {
    return axios
      .get(`${Server.BASE_API_URL}/course/${id}`, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        return res.data.data;
      });
  };

  getCourseForTrainer = () => {
    return axios
      .get(`${Server.BASE_API_URL}/course/my-courses`, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data && res.data.success) return res.data.data;
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  getPurchasedCourse = () => {
    return axios
      .get(`${Server.BASE_API_URL}/course/subscription/`, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data && res.data.success) return res.data.data;
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  addNewCourse(course) {
    return axios
      .post(`${Server.BASE_API_URL}/course`, course, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data && res.data.success) return res.data;
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  updateCourse(courseId, course) {
    return axios
      .put(`${Server.BASE_API_URL}/course/${courseId}`, course, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data && res.data.success) return res.data;
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  verifyCourse(courseId, status) {
    const data = { courseId, status };
    return axios
      .post(`${Server.BASE_API_URL}/course/verify`, data, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data) return res.data.success;
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  uploadVideo(file) {
    let uploadFile = new FormData();
    uploadFile.append("file", file);
    uploadFile.append("filename", file.name);
    return axios
      .post(`${Server.BASE_URL}/upload`, uploadFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          return res.data;
        }
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  purchaseCourse(data) {
    return axios
      .post(`${Server.BASE_API_URL}/course/transact`, data, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res) return res.data;
      })
      .catch((err) => console.log(err));
  }

  postRating(data) {
    return axios
      .put(`${Server.BASE_API_URL}/course-ratings/`, data, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res) return res.data;
        console.log(res);
      })
      .catch((err) => console.log(err.response));
  }

  deleteCourse(courseId) {
    return axios
      .delete(`${Server.BASE_API_URL}/course/${courseId}`, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          return res.data.data;
        }
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
}
