import React from "react";

const initialCartValue = [];

export const CartReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return [...state, action.courseId];
    case "remove":
      return state.splice(state.indexOf(action.courseId), 1);
    case "reset":
      return initialCartValue;
    default:
      return state;
  }
};

export const CartContext = React.createContext();
