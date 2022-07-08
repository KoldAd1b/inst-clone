import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./ModalSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
  },
});

export default store;
