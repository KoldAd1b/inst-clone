import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    doneChecking: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    doneChecking(state, action) {
      state.doneChecking = true;
    },
    removeUser(state, action) {
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
