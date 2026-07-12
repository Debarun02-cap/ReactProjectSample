// Auth reducer (plain Redux — this project uses createStore, not @reduxjs/toolkit).
// Handles the signup and login flows: request -> success | error.

import type { RegisterApiPayload } from './transformer';

// ----- Action types -----
export const SIGNUP_REQUEST = 'auth/signupRequest';
export const SIGNUP_SUCCESS = 'auth/signupSuccess';
export const SIGNUP_ERROR   = 'auth/signupError';

export const LOGIN_REQUEST = 'auth/loginRequest';
export const LOGIN_SUCCESS = 'auth/loginSuccess';
export const LOGIN_ERROR   = 'auth/loginError';

// ----- Login payload -----
export interface LoginPayload {
    email: string;
    password: string;
    role: string;
}

// ----- Action shapes -----
export interface SignupRequestAction {
    type: typeof SIGNUP_REQUEST;
    payload: RegisterApiPayload;
}

export interface SignupSuccessAction {
    type: typeof SIGNUP_SUCCESS;
    payload: unknown; // backend response (e.g. created user / token)
}

export interface SignupErrorAction {
    type: typeof SIGNUP_ERROR;
    payload: string; // error message
}

// ----- Login action shapes -----
export interface LoginRequestAction {
    type: typeof LOGIN_REQUEST;
    payload: LoginPayload;
}

export interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
    payload: unknown; // backend response (e.g. user object / token)
}

export interface LoginErrorAction {
    type: typeof LOGIN_ERROR;
    payload: string; // error message
}

// ----- Action creators -----
export const signupRequest = (
    payload: RegisterApiPayload,
): SignupRequestAction => ({
    type: SIGNUP_REQUEST,
    payload,
});

export const signupSuccess = (payload: unknown): SignupSuccessAction => ({
    type: SIGNUP_SUCCESS,
    payload,
});

export const signupError = (error: string): SignupErrorAction => ({
    type: SIGNUP_ERROR,
    payload: error,
});

// ----- Login action creators -----
export const loginRequest = (payload: LoginPayload): LoginRequestAction => ({
    type: LOGIN_REQUEST,
    payload,
});

export const loginSuccess = (payload: unknown): LoginSuccessAction => ({
    type: LOGIN_SUCCESS,
    payload,
});

export const loginError = (error: string): LoginErrorAction => ({
    type: LOGIN_ERROR,
    payload: error,
});

// ----- Logout action types -----
export const LOGOUT_REQUEST = 'auth/logoutRequest';
export const LOGOUT_SUCCESS = 'auth/logoutSuccess';
export const LOGOUT_ERROR   = 'auth/logoutError';

// ----- Logout action shapes -----
export interface LogoutRequestAction {
    type: typeof LOGOUT_REQUEST;
}

export interface LogoutSuccessAction {
    type: typeof LOGOUT_SUCCESS;
}

export interface LogoutErrorAction {
    type: typeof LOGOUT_ERROR;
    payload: string;
}

export type AuthAction =
    | SignupRequestAction
    | SignupSuccessAction
    | SignupErrorAction
    | LoginRequestAction
    | LoginSuccessAction
    | LoginErrorAction
    | LogoutRequestAction
    | LogoutSuccessAction
    | LogoutErrorAction;

// ----- Logout action creators -----
export const logoutRequest = (): LogoutRequestAction => ({
    type: LOGOUT_REQUEST,
});

export const logoutSuccess = (): LogoutSuccessAction => ({
    type: LOGOUT_SUCCESS,
});

export const logoutError = (error: string): LogoutErrorAction => ({
    type: LOGOUT_ERROR,
    payload: error,
});
