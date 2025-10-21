import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: null,
  forgotPasswordEmail: null,
};


export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUser: (state) => {
      state.userDetails = null;
    },
    setForgotPasswordEmail: (state, action) => {
      state.forgotPasswordEmail = action.payload;
    },
    clearForgotPasswordEmail: (state) => {
      state.forgotPasswordEmail = null;
    },
  },
  
});

export const { setUser, clearUser, setForgotPasswordEmail, clearForgotPasswordEmail } = userSlice.actions;

export default userSlice.reducer;
