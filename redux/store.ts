import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user";
import voteReducer from "./features/vote";
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    voteReducer,
    userReducer
  },
  middleware: [thunk, logger],
  devTools: process.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;