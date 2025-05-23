// src/slices/customer-group-slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { CustomerGroupType } from '@/types/customer-group-types'; // Import the group type
// Import the response type defined in the service or types
import type { ListCustomerGroupsResponse } from '@/services/customer-group-service';

// Define the state structure for this slice
interface CustomerGroupState {
  data: CustomerGroupType[]; // Array of customer groups
  total: number; // Total count for pagination
  loading: boolean; // Loading state
  error: string | null; // Error state
}

// Define the initial state
const initialState: CustomerGroupState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

const customerGroupSlice = createSlice({
  name: 'customerGroups', // Key in the root state
  initialState,
  reducers: {
    // Action to update state after fetching groups
    // Expects the payload to match ListCustomerGroupsResponse structure
    fetchCustomerGroups(state, action: PayloadAction<ListCustomerGroupsResponse>) {
      state.data = action.payload.items;
      state.total = action.payload.total;
      state.loading = false; // Reset loading/error on successful fetch
      state.error = null;
    },
    // Action to set loading state explicitly (optional, if needed)
    setGroupLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // Action to set error state (optional)
    setGroupError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false; // Stop loading on error
    },
  },
});

// Export the actions
export const {
  fetchCustomerGroups,
  setGroupLoading,
  setGroupError,
} = customerGroupSlice.actions;

// --- Selectors ---

// Select the entire state of this slice
export const selectCustomerGroupSliceState = (state: RootState): CustomerGroupState => state.customerGroups;

// Select just the array of customer groups
export const selectCustomerGroups = (state: RootState): CustomerGroupType[] => state.customerGroups.data;

// Select the total count of customer groups
export const selectCustomerGroupsTotal = (state: RootState): number => state.customerGroups.total;

// Select the loading state
export const selectCustomerGroupsLoading = (state: RootState): boolean => state.customerGroups.loading;

// Select the error state
export const selectCustomerGroupsError = (state: RootState): string | null => state.customerGroups.error;


// Export the reducer
export default customerGroupSlice.reducer;