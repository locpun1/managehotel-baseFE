import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/slices/auth';
import customerReducer from '@/slices/customer-slice';
import userReducer from '@/slices/user';

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  customer: customerReducer,
});

export default rootReducer;
