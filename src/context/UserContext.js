import React from "react";

const userLocalInfo = JSON.parse(sessionStorage.getItem("user_info"));
const authToken = sessionStorage.getItem("auth_cookie");

export const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      sessionStorage.setItem("auth_cookie", action.payload.token);
      sessionStorage.setItem(
        "user_info",
        JSON.stringify(action.payload.userInfo)
      );

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
      state["isAuthenticated"] = authToken && authToken !== "";
      state["user"] = userLocalInfo ? userLocalInfo : state["user"];
      state["token"] = authToken;

      return state;
    default:
      return state;
  }
};

export const UserContext = React.createContext();
