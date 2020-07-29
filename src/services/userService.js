import axios from "axios";
import { Server, AppDefault } from "../config";

export default class UserService {
  accessToken = sessionStorage.getItem("auth_cookie");

  registerUser = async (userData) => {
    let registerUrl;
    switch (userData.role) {
      case "user":
        registerUrl = "register-user";
        break;
      case "trainer":
        registerUrl = "register-trainer";
        break;
      case "reviewer":
        registerUrl = "register-reviewer";
        break;
      default:
        registerUrl = "";
    }
    return axios
      .post(`${Server.BASE_API_URL}/${registerUrl}`, {
        name: userData.name,
        email: userData.email,
        profileImage: userData.profileImg,
        googleId: userData.googleId,
        redirectUrl: `${AppDefault.BASE_PATH}/password-reset`,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  signInAsUser = async (userCred) => {
    return axios
      .post(`${Server.BASE_API_URL}/login-user/`, userCred)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  signInAsTrainer = async (userCred) => {
    return axios
      .post(`${Server.BASE_API_URL}/login-trainer/`, userCred)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  signInAsReviewer = async (userCred) => {
    return axios
      .post(`${Server.BASE_API_URL}/login-reviewer/`, userCred)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  signInAsAdmin = async (userCred) => {
    return axios
      .post(`${Server.BASE_API_URL}/login-admin/`, userCred)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  resetPassword = (username, token, password) => {
    return axios
      .post(
        `${Server.BASE_API_URL}/verify-user?username=${username}&token=${token}`,
        { password }
      )
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  forgotPassword = (email) => {
    return axios
      .get(
        `${Server.BASE_API_URL}/forgot-password?email=${email}&redirectUrl=${AppDefault.BASE_PATH}/login/password-reset`
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  };

  fetchUserDetails = async () => {
    return axios
      .get(`${Server.BASE_API_URL}/user`, {
        headers: {
          Authorization: this.accessToken,
        },
      })
      .then((res) => {
        if (res.data && res.data.success) return res.data.data;
      })
      .catch((err) => console.log(err));
  };

  logoutUser = () => {
    sessionStorage.clear();
  };
}
