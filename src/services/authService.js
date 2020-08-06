import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router";
import { UserContext } from "../context/UserContext";

const checkAuthorization = (context, role) => {
  let isAuthorized =
    context && context.userState && context.userState.isAuthenticated;
  if (role && role.length > 0 && isAuthorized) {
    isAuthorized =
      context.userState.user && role.includes(context.userState.user["role"]);
  }
  return isAuthorized;
};

export default function requireAuth(Component, role) {
  function AuthenticatedComponent(props) {
    const userContext = useContext(UserContext);

    useEffect(() => {
      const location = props.location;
      const redirect = location.pathname + location.search;
      console.log("UseEffect - AuthService");

      if (!checkAuthorization(userContext, role))
        props.history.push(`/login?return=${redirect}`);
    }, [props, userContext]);

    return checkAuthorization(userContext, role) ? (
      <Component {...props} />
    ) : null;
  }
  return withRouter(AuthenticatedComponent);
}
