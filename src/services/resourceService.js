import axios from "axios";
import AppUtils from "../utilities/AppUtils";
import { Server } from "../config";

export default class ResourceService {
  accessToken = AppUtils.getLocalItem("auth_cookie");

  uploadCourseImage(file) {
    let uploadFile = new FormData();
    uploadFile.append("file", file);
    return axios
      .post(`${Server.BASE_API_URL}/upload/image`, uploadFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          return res.data;
        }
      })
      .catch((err) => console.log(err.response));
  }

  uploadHTMLFile(content) {
    const body = { content: content };
    return axios
      .post(`${Server.BASE_API_URL}/upload/docs`, body)
      .then((res) => {
        if (res.statusText === "OK") {
          return res.data;
        }
      })
      .catch((err) => console.log(err.response));
  }
}
