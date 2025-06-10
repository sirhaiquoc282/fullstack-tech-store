import { combineReducers } from "redux";
import  cartSlice from "./features/CartSlice";
import { configureStore } from "@reduxjs/toolkit";
import  authenSlice  from "./features/AuthenSlice";
import WishListSlice from "./features/WishListSlice";

const reducer = combineReducers({
  cartSlice,
  authenSlice,
  WishListSlice,
});

export const store = configureStore({
  reducer,
});
