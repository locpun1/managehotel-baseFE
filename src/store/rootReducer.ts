import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/slices/auth';
import customerReducer from '@/slices/customer-slice';
import userReducer from '@/slices/user';
import customerGroupReducer from '@/slices/customer-group-slice';
import customerAddressReducer from '@/slices/customer-address-slice';

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  customer: customerReducer,
  customerGroups: customerGroupReducer,
  customerAddress: customerAddressReducer,
});

export default rootReducer;
