import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./slices/authSlice";
import transactionreducer from "./slices/transactionSlice";
import settingsreducer from "./slices/settingsSlice";
import dashboardreducer from "./slices/dashboardSlice";
import reportsreducer from "./slices/reportsSlice";

const store = configureStore({
  reducer: {
    auth: authreducer,
    transaction: transactionreducer,
    settings: settingsreducer,
    dashboard: dashboardreducer,
    reports: reportsreducer,
  },
});

export default store;
