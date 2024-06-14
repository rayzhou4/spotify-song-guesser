import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  accessToken: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.value = action.payload;
    }
  }
})

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;