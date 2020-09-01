import React from "react";

const getStoredAuthToken = () => {
  let localToken = localStorage.getItem("auth_cookie");
  let sessionToken = sessionStorage.getItem("auth_cookie");
  if (localToken) return localToken;
  if (sessionToken) return sessionToken;
  return "";
};

const getStoredUserInfo = () => {
  let localInfo = JSON.parse(localStorage.getItem("user_info"));
  let sessionInfo = JSON.parse(sessionStorage.getItem("user_info"));
  if (localInfo) return localInfo;
  if (sessionInfo) return sessionInfo;
  return null;
};

export const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      if (action.payload.rememberMe) {
        localStorage.setItem("auth_cookie", action.payload.token);
        localStorage.setItem(
          "user_info",
          JSON.stringify(action.payload.userInfo)
        );
      } else {
        sessionStorage.setItem("auth_cookie", action.payload.token);
        sessionStorage.setItem(
          "user_info",
          JSON.stringify(action.payload.userInfo)
        );
      }

      state["isAuthenticated"] = true;
      state["user"] = action.payload.userInfo;
      state["token"] = action.payload.token;

      return state;
    case "LOGOUT":
      localStorage.clear();
      sessionStorage.clear();

      state["isAuthenticated"] = false;
      state["user"] = "";
      state["token"] = "";

      return state;
    case "RESET":
      const authToken = getStoredAuthToken();
      const userLocalInfo = getStoredUserInfo();
      state["isAuthenticated"] = authToken && authToken !== "";
      state["user"] = userLocalInfo ? userLocalInfo : state["user"];
      state["token"] = authToken;

      return state;
    default:
      return state;
  }
};

export const UserContext = React.createContext();
