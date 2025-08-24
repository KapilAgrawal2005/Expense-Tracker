import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const initialState = {
  loading: false,
  error: null,
  data: {
    monthlySpending: [],
    categoryBreakdown: [],
    comparisonData: [],
    summaryStats: {
      totalIncome: 0,
      totalExpenses: 0,
      savingsRate: 0,
      largestExpenseCategory: 'N/A',
      largestExpenseAmount: 0
    }
  }
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    getReportsDataRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getReportsDataSuccess(state, action) {
      state.loading = false;
      state.data = action.payload.data;
      state.error = null;
    },
    getReportsDataFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetReportsState(state) {
      state.error = null;
    }
  }
});

export const {
  getReportsDataRequest,
  getReportsDataSuccess,
  getReportsDataFailed,
  resetReportsState
} = reportsSlice.actions;

export const getReportsData = (timeRange = 'monthly') => async (dispatch) => {
  dispatch(getReportsDataRequest());
  try {
    const res = await axios.get(`${serverUrl}/api/transaction/reports?timeRange=${timeRange}`, {
      withCredentials: true,
    });
    dispatch(getReportsDataSuccess(res.data));
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(getReportsDataFailed(errorMsg));
  }
};

export default reportsSlice.reducer;
