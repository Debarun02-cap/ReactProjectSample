// Auth reducer (plain Redux — this project uses createStore, not @reduxjs/toolkit).
// Handles the signup flow: request -> success | error.

import type { RegisterApiPayload } from '../actions/transformer';

// ----- Action types -----
export const SIGNUP_REQUEST = 'auth/signupRequest';
export const SIGNUP_SUCCESS = 'auth/signupSuccess';
export const SIGNUP_ERROR = 'auth/signupError';

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

export type AuthAction =
    | SignupRequestAction
    | SignupSuccessAction
    | SignupErrorAction;

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

// ----- State -----
export interface AuthState {
    loading: boolean;
    error: string | null;
    user: unknown | null;
}

const initialState: AuthState = {
    loading: false,
    error: null,
    user: null,
};

// ----- Reducer -----
export function authReducer(
    state: AuthState = initialState,
    action: AuthAction,
): AuthState {
    switch (action.type) {
        case SIGNUP_REQUEST:
            return { ...state, loading: true, error: null };
        case SIGNUP_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case SIGNUP_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default authReducer;
