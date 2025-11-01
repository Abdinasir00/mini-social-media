// store.js
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import authReducer from "./slices/auth";
import postReducer from "./slices/PostSlices"
import  notificationRducer  from "./slices/notificationSlice";
import profileReducer from "./slices/profileSlice"

const store = configureStore({
  reducer: {
    users: searchReducer,
    auth: authReducer, 
    post: postReducer,
    notifications: notificationRducer,
    profile: profileReducer,
  },
});

export default store;
