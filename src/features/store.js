// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';

export default  configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
  },
});


