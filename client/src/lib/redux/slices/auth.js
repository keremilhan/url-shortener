import { createSlice } from '@reduxjs/toolkit';
import { getUserFromLocalStorage } from '../../../utils/functions';
import { removeUserFromLocalStorage, saveUserToLocalStorage } from '../../../utils/functions';

const initialState = getUserFromLocalStorage() || {
    name: '',
    accessToken: '',
    email: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.name = action.payload.name;
            state.accessToken = action.payload.accessToken;
            state.email = action.payload.email;
            saveUserToLocalStorage(action.payload);
        },
        logout: state => {
            state.name = '';
            state.accessToken = '';
            state.email = '';
            removeUserFromLocalStorage();
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export const selectAuth = state => state.auth;
export default authSlice.reducer;
