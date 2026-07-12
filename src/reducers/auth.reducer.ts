// Auth reducer (plain Redux — this project uses createStore, not @reduxjs/toolkit).
// Handles the signup and login flows: request -> success | error.

import {
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_ERROR,
    type AuthAction
} from '../actions/auth.slice';

// ----- State -----
export interface AuthState {
    loading: boolean;
    error: string | null;
    user: unknown | null;
}

const storedUser = sessionStorage.getItem('user');
let initialUser = null;
if (storedUser) {
    try {
        initialUser = JSON.parse(storedUser);
    } catch (e) {
        initialUser = null;
    }
}

const initialState: AuthState = {
    loading: false,
    error: null,
    user: initialUser,
};

// ----- Reducer -----
export function authReducer(
    state: AuthState = initialState,
    action: AuthAction,
): AuthState {
    switch (action.type) {
        case SIGNUP_REQUEST:
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
            return { ...state, loading: true, error: null };
        case SIGNUP_SUCCESS:
        case LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case LOGOUT_SUCCESS:
            return { ...state, loading: false, user: null, error: null };
        case SIGNUP_ERROR:
        case LOGIN_ERROR:
        case LOGOUT_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default authReducer;

