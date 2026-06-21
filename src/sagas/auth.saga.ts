// Auth saga: handles the signup flow by calling the backend register API.

import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { BASE_URL, APIConstants } from '../apis/api.constants';
import {
    SIGNUP_REQUEST,
    signupSuccess,
    signupError,
    type SignupRequestAction,
} from '../actions/auth.slice';
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
export function* signUpSaga(action: SignupRequestAction) {
    try {
        const response: Awaited<ReturnType<typeof postRegister>> = yield call(
            postRegister,
            action.payload,
        );
        yield put(signupSuccess(response.data));
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

/** Watcher saga: listens for signup requests. */
export function* authSaga() {
    yield takeLatest(SIGNUP_REQUEST, signUpSaga);
}

export default authSaga;
