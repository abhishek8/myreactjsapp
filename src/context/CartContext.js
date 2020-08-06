import React from "react";

let localCart = sessionStorage.getItem("app_cart");
localCart = localCart ? JSON.parse(localCart) : [];

export const CartReducer = (state, action) => {
  let cartChanges;
  switch (action.type) {
    case "ADD":
      cartChanges = [...state, action.courseId];
      sessionStorage.setItem("app_cart", JSON.stringify(cartChanges));
      return cartChanges;
    case "REMOVE":
      let pos = state.indexOf(action.courseId);
      if (pos > -1) state.splice(pos, 1);
      cartChanges = [...state];
      sessionStorage.setItem("app_cart", JSON.stringify(cartChanges));
      return cartChanges;
    case "INITIAL":
      return [...localCart];
    case "CLEAR":
      sessionStorage.removeItem("app_cart");
      cartChanges = [];
      return cartChanges;
    default:
      return state;
  }
};

export const CartContext = React.createContext();
