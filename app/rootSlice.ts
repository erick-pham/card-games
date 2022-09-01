import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { AlertColor } from "@mui/material/Alert";
// Type for our state
export interface RootState {
  authState: boolean;
  loading: boolean;
  loadingMessage: object;
  error: {
    message: string;
    values: string;
    severity: AlertColor;
  };
}

// Initial state
const initialState: RootState = {
  authState: false,
  loading: false,
  loadingMessage: {},
  error: {
    message: "",
    values: "",
    severity: "error",
  },
};

// Actual Slice
export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    // Action to set the authentication status
    setErrorState(state, action) {
      state.error = action.payload;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    // extraReducers: {
    //   [HYDRATE]: (state, action) => {
    //     return {
    //       ...state,
    //       ...action.payload.auth,
    //     };
    //   },
    // },
  },
});

export const { setErrorState } = rootSlice.actions;

export const selectErrorState = (state: AppState) => state.root.error;

export default rootSlice.reducer;
