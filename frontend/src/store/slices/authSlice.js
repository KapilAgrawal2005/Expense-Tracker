/*eslint-disable*/
import { createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl="http://localhost:5000";

const authSlice = createSlice({
    name: "auth",
    initialState:{
        loading: false,
        error: null,
        message: null,
        isAuthenticated:false,
        user:null,
    },
    reducers:{
        signUpRequest(state){
            state.error = null;
            state.message = null;
            state.loading = true;
        },
        signUpRequestSuccess(state, action){
            state.error = null;
            state.message = action.payload.message;
            state.loading = false;
        },
        signUpRequestFailed(state, action){
            state.loading = false;
            state.error = action.payload;
        },
        resetAuthSlice(state){
            state.error=null;
            state.loading=false;
            state.user=state.user;
            state.message=null;
            state.isAuthenticated=state.isAuthenticated;
        },
        loginRequest(state){
            state.error = null;
            state.message = null;
            state.loading = true;
        },
        loginRequestSuccess(state, action){
            state.error = null;
            state.message = action.payload.message;
            state.loading = false;
            state.isAuthenticated = true;
            state.user = null;
        },
        loginRequestFailed(state, action){
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest(state){
            state.error = null;
            state.message = null;
            state.loading = true;
        },
        logoutRequestSuccess(state, action){
            state.error = null;
            state.message = action.payload.message;
            state.loading = false;
            state.isAuthenticated = false;
            state.user=null
        },
        logoutRequestFailed(state, action){
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const resetAuthSlice=()=>(dispatch)=>{
    dispatch(authSlice.actions.resetAuthSlice());
}

export const signup = (data) => async(dispatch) =>{
    dispatch(authSlice.actions.signUpRequest());
    await axios.post(`${serverUrl}/api/auth/signup`, data , {
        withCredentials: true,
        headers:{
            "Content-Type" : "application/json"
        },
    }).then((res) => {
        dispatch(authSlice.actions.signUpRequestSuccess(res.data.message));
    }).catch((error)=>{
        dispatch(authSlice.actions.signUpRequestFailed(error.response.data.message));
    })
}

export const login = (data) => async(dispatch) =>{
    dispatch(authSlice.actions.loginRequest());
    await axios.post(`${serverUrl}/api/auth/login`, data , {
        withCredentials: true,
        headers:{
            "Content-Type" : "application/json"
        },
    }).then((res) => {
        dispatch(authSlice.actions.loginRequestSuccess(res.data.message));
    }).catch((error)=>{
        dispatch(authSlice.actions.loginRequestFailed(error.response.data.message));
    })
}

export const logout = () => async(dispatch) =>{
    dispatch(authSlice.actions.logoutRequest());
    try {
        const res = await axios.post(`${serverUrl}/api/auth/logout`, {}, {
            withCredentials: true,
        });
        dispatch(authSlice.actions.logoutRequestSuccess(res.data));
        // Clear any stored user data
        localStorage.removeItem('user');
        sessionStorage.clear();
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Logout failed';
        dispatch(authSlice.actions.logoutRequestFailed(errorMsg));
        // Even if logout fails on server, clear local state
        dispatch(authSlice.actions.logoutRequestSuccess({ message: 'Logged out locally' }));
    }
}

export default authSlice.reducer;