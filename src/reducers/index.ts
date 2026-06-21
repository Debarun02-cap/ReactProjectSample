import { combineReducers } from 'redux';
import authSlices from '../actions/auth.slice';

const rootReducer = combineReducers({
    auth: authSlices,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
