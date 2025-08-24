import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl = "http://localhost:5000";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    loading: false,
    error: null,
    message: null,
    transactionList: [],
  },
  reducers: {
    createTransactionRequest(state) {
      state.error = null;
      state.message = null;
      state.loading = true;
    },
    createTransactionSuccess(state, action) {
      state.error = null;
      state.message = action.payload.message;
      state.loading = false;
    },
    createTransactionFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetTransactionSlice(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
    },
    getAllTransactionRequest(state) {
      state.error = null;
      state.message = null;
      state.loading = true;
    },
    getAllTransactionSuccess(state, action) {
      state.error = null;
      state.message = action.payload.message;
      state.transactionList = action.payload.transactions;
      state.loading = false;
    },
    getAllTransactionFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getTransactionByIdRequest(state) {
      state.error = null;
      state.message = null;
      state.loading = true;
    },
    getTransactionByIdSuccess(state, action) {
      state.error = null;
      state.message = action.payload.message;
      state.loading = false;
    },
    getTransactionByIdFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTransactionRequest(state) {
      state.error = null;
      state.message = null;
      state.loading = true;
    },
    deleteTransactionSuccess(state, action) {
      state.error = null;
      state.message = action.payload.message;
      state.loading = false;
    },
    deleteTransactionFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTransactionRequest(state) {
      state.error = null;
      state.message = null;
      state.loading = true;
    },
    updateTransactionSuccess(state, action) {
      state.error = null;
      state.message = action.payload.message;
      state.loading = false;
    },
    updateTransactionFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const resetTransactionSlice = () => (dispatch) => {
  dispatch(transactionSlice.actions.resetTransactionSlice());
};

export const createTransaction = (data) => async(dispatch) => {
  dispatch(transactionSlice.actions.createTransactionRequest());
  try {
    const res = await axios.post(`${serverUrl}/api/transaction/create`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    
    dispatch(transactionSlice.actions.createTransactionSuccess(res.data));
    dispatch(getAllTransaction())
    
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    return dispatch(transactionSlice.actions.createTransactionFailed(errorMsg));
  }
};

export const getAllTransaction = () => async(dispatch) => {
  dispatch(transactionSlice.actions.getAllTransactionRequest());
  try {
    const res = await axios.get(`${serverUrl}/api/transaction/all`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    
    dispatch(transactionSlice.actions.getAllTransactionSuccess({
      message: res.data.message,
      transactions: res.data.transactions
    }));
    
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(transactionSlice.actions.getAllTransactionFailed(errorMsg));
  }
};

export const getTransactionById = (id) => async (dispatch) => {
  dispatch(transactionSlice.actions.getTransactionByIdRequest());
  await axios
    .get(`${serverUrl}/api/transaction/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(
        transactionSlice.actions.getTransactionByIdSuccess(res.data.message)
      );
    })
    .catch((error) => {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      dispatch(transactionSlice.actions.getTransactionByIdFailed(errorMsg));
    });
};

export const deleteTransaction = (id) => async (dispatch) => {
  dispatch(transactionSlice.actions.deleteTransactionRequest());
  await axios
    .delete(`${serverUrl}/api/transaction/delete/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(transactionSlice.actions.deleteTransactionSuccess(res.data));
      dispatch(getAllTransaction()); // Refresh the list
    })
    .catch((error) => {
      const errorMsg = error.response?.data || error.message;
      dispatch(transactionSlice.actions.deleteTransactionFailed(errorMsg));
    });
};

export const updateTransaction = (data) => async (dispatch) => {
  dispatch(transactionSlice.actions.updateTransactionRequest());
  console.log(data)
  await axios
    .put(`${serverUrl}/api/transaction/edit/${data.id}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(transactionSlice.actions.updateTransactionSuccess(res.data));
      dispatch(getAllTransaction()); // Refresh the list
    })
    .catch((error) => {
      const errorMsg = error.response?.data || error.message;
      dispatch(transactionSlice.actions.updateTransactionFailed(errorMsg));
    });
};

export default transactionSlice.reducer;
