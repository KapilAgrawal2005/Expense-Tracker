import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const serverUrl = "http://localhost:5000";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    initialBalanceRequired: false,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    getDashboardDataRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getDashboardDataSuccess(state, action) {
      state.loading = false;
      state.data = action.payload; // <-- FIXED: use payload directly
      state.initialBalanceRequired = action.payload.initialBalanceRequired;
    },
    getDashboardDataFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setInitialBalanceRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    setInitialBalanceSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.initialBalanceRequired = false;
    },
    setInitialBalanceFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetDashboardState(state) {
      state.error = null;
      state.message = null;
    }
  }
});

export const {
  getDashboardDataRequest,
  getDashboardDataSuccess,
  getDashboardDataFailed,
  setInitialBalanceRequest,
  setInitialBalanceSuccess,
  setInitialBalanceFailed,
  resetDashboardState
} = dashboardSlice.actions;

export const getDashboardData = () => async (dispatch) => {
  dispatch(getDashboardDataRequest());
  try {
    const res = await axios.get(`${serverUrl}/api/dashboard`, {
      withCredentials: true,
    });
    dispatch(getDashboardDataSuccess(res.data)); // <-- FIXED: pass res.data directly
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(getDashboardDataFailed(errorMsg));
  }
};

export const setInitialBalance = (amount) => async (dispatch) => {
  dispatch(setInitialBalanceRequest());
  try {
    const res = await axios.post(
      `${serverUrl}/api/dashboard/initial-balance`,
      { initialBalance: amount },
      { withCredentials: true }
    );
    dispatch(setInitialBalanceSuccess(res.data));
    dispatch(getDashboardData()); // Refresh dashboard data
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(setInitialBalanceFailed(errorMsg));
  }
};

export default dashboardSlice.reducer;