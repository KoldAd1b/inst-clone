import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    openUtility: false,
    openPost: false,
  },
  reducers: {
    setModal(state, action) {
      state.open = action.payload;
    },
    setUtilityModal(state, action) {
      state.openUtility = action.payload;
    },
    setPostModal(state, action) {
      state.openPost = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
