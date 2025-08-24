import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const serverUrl = "http://localhost:5000";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    getSettingsRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getSettingsSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
    },
    getSettingsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateSettingsRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateSettingsSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = { ...state.user, ...action.payload.updates };
    },
    updateSettingsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetSettingsState(state) {
      state.error = null;
      state.message = null;
    }
  }
});

// Action Creators
export const getUserSettings = () => async (dispatch) => {
  dispatch(settingsSlice.actions.getSettingsRequest());
  try {
    const res = await axios.get(`${serverUrl}/api/profile`, {
      withCredentials: true,
    });
    dispatch(settingsSlice.actions.getSettingsSuccess(res.data));
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(settingsSlice.actions.getSettingsFailed(errorMsg));
  }
};

export const updateProfile = (data) => async (dispatch) => {
  dispatch(settingsSlice.actions.updateSettingsRequest());
  try {
    const res = await axios.put(`${serverUrl}/api/profile/update`, data, {
      withCredentials: true,
    });
    dispatch(settingsSlice.actions.updateSettingsSuccess({
      message: res.data.message,
      updates: { name: data.name, email: data.email }
    }));
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(settingsSlice.actions.updateSettingsFailed(errorMsg));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(settingsSlice.actions.updateSettingsRequest());
  try {
    const res = await axios.put(`${serverUrl}/api/profile/password`, data, {
      withCredentials: true,
    });
    dispatch(settingsSlice.actions.updateSettingsSuccess({
      message: res.data.message
    }));
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(settingsSlice.actions.updateSettingsFailed(errorMsg));
  }
};

// export const updatePreferences = (data) => async (dispatch) => {
//   dispatch(settingsSlice.actions.updateSettingsRequest());
//   try {
//     const res = await axios.put(`${serverUrl}/api/settings/preferences`, data, {
//       withCredentials: true,
//     });
//     dispatch(updateSettingsSuccess({
//       message: res.data.message,
//       updates: data
//     }));
//   } catch (error) {
//     const errorMsg = error.response?.data?.message || error.message;
//     dispatch(updateSettingsFailed(errorMsg));
//   }
// };

export default settingsSlice.reducer;