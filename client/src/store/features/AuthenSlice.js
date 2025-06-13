// store/features/AuthenSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: localStorage.getItem("username") || "",
  isLogin:
    localStorage.getItem("username") !== null &&
    localStorage.getItem("username") !== "" &&
    localStorage.getItem("username") !== undefined
};

export const authenSlice = createSlice({
  name: "authenSlice",
  initialState,
  reducers: {
    doLogin: (state, action) => {
      const { email } = action.payload;
      const username = email.split("@")[0];
      localStorage.setItem("username", username);
      state.username = username;
      state.isLogin = true;
    },
    doLoguot: (state) => {
      localStorage.removeItem("username");
      localStorage.removeItem("accessToken")
      state.username = "";
      state.isLogin = false;
    }
  }
});

export const { doLogin, doLoguot } = authenSlice.actions;
export default authenSlice.reducer;
