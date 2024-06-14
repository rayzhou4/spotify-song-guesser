import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: "",
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.value = action.payload;
    }
  }
})

export const { setAccessToken } = tokenSlice.actions;

export const selectToken = (state) => state.token.value

export default tokenSlice.reducer;