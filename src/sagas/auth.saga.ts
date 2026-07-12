import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { BASE_URL, APIConstants } from '../apis/api.constants';
import {
    SIGNUP_REQUEST,
    signupSuccess,
    signupError,
    LOGIN_REQUEST,
    loginSuccess,
    loginError,
    LOGOUT_REQUEST,
    logoutSuccess,
    logoutError,
    type SignupRequestAction,
    type LoginRequestAction,
} from '../actions/auth.slice';
import { postLogin, postLogout } from '../apis/functions';
import type { RegisterApiPayload } from '../actions/transformer';

const apiConstants = new APIConstants();

/** POSTs the register payload to the backend signup endpoint. */
function postRegister(payload: RegisterApiPayload) {
    return axios.post(`${BASE_URL}${apiConstants.AUTH.REGISTER}`, payload);
}

/**
 * Worker saga: runs on each SIGNUP_REQUEST.
 * Calls postRegister and dispatches success/error accordingly.
 */
export function* signUpSaga(action: SignupRequestAction): any {
    try {
        const response: Awaited<ReturnType<typeof postRegister>> = yield call(
            postRegister,
            action.payload,
        );
        console.log('Signup success', response?.data);
        yield put(signupSuccess(response?.data));
    } catch (err) {
        const message =
            axios.isAxiosError(err) && err.response?.data
                ? (err.response.data as { message?: string }).message ?? err.message
                : err instanceof Error
                    ? err.message
                    : 'Signup failed.';
        yield put(signupError(message));
    }
}

/**
 * Worker saga: runs on each LOGIN_REQUEST.
 * Calls postLogin and dispatches loginSuccess/loginError accordingly.
 */
export function* logInSaga(action: LoginRequestAction): any {
    try {
        const data: Awaited<ReturnType<typeof postLogin>> = yield call(
            postLogin,
            action.payload,
        );
        console.log('Login success', data);
        sessionStorage.setItem('user', JSON.stringify(data));
        yield put(loginSuccess(data));
    } catch (err) {
        const message =
            axios.isAxiosError(err) && err.response?.data
                ? (err.response.data as { message?: string }).message ?? err.message
                : err instanceof Error
                    ? err.message
                    : 'Login failed.';
        yield put(loginError(message));
    }
}

/**
 * Worker saga: runs on each LOGOUT_REQUEST.
 * Calls postLogout and dispatches logoutSuccess/logoutError accordingly.
 */
export function* logOutSaga(): any {
    try {
        yield call(postLogout);
        sessionStorage.removeItem('user');
        yield put(logoutSuccess());
    } catch (err) {
        const message =
            axios.isAxiosError(err) && err.response?.data
                ? (err.response.data as { message?: string }).message ?? err.message
                : err instanceof Error
                    ? err.message
                    : 'Logout failed.';
        yield put(logoutError(message));
    }
}

/** Watcher saga: listens for signup, login, and logout requests. */
export function* authSaga(): any {
    yield takeLatest(SIGNUP_REQUEST, signUpSaga);
    yield takeLatest(LOGIN_REQUEST, logInSaga);
    yield takeLatest(LOGOUT_REQUEST, logOutSaga);
}

export default authSaga;
