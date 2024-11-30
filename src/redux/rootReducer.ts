import { combineReducers } from 'redux';

import authReducer from './features/auth/authSlice';
import userReducer from './features/auth/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});
export default rootReducer;
