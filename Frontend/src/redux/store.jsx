import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session"; // Use sessionStorage instead of localStorage
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import rootReducer from "./slice";

const persistConfig = {
  key: "root",
  storage: sessionStorage, // Use sessionStorage for clearing data when the tab is closed
  stateReconciler: autoMergeLevel2,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, REGISTER, PAUSE, PURGE, PERSIST],
      // },
    }),
  devTools: process.env.NODE_ENV === "development",
});

export const Presistor = persistStore(store);

export default store;
// .concat(loggerMiddleware)