import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { AlertColor } from "@mui/material/Alert";
// Type for our state
export interface RootState {
  themeMode: "light" | "dark";
  authState: boolean;
  loading: boolean;
  loadingMessage: {
    id: boolean | null;
    defaultMessage: string | null;
  };
  error: {
    message: string;
    values: string;
    severity: AlertColor;
  };
  dialogImage: {
    open: boolean;
    url: string | null | undefined;
  };
}

// Initial state
const initialState: RootState = {
  themeMode: "light",
  authState: false,
  loading: false,
  loadingMessage: {
    id: null,
    defaultMessage: null,
  },
  error: {
    message: "",
    values: "",
    severity: "error",
  },
  dialogImage: {
    open: false,
    url: "",
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
    setLoadingState(state, action) {
      state.loading = action.payload.loading || false;
      state.loadingMessage = action.payload.loadingMessage || {};
    },
    setDialogImageState(state, action) {
      state.dialogImage = action.payload;
    },
    setThemeModeState(state, action) {
      state.themeMode = action.payload;
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

export const {
  setErrorState,
  setLoadingState,
  setDialogImageState,
  setThemeModeState,
} = rootSlice.actions;

export const selectErrorState = (state: AppState) => state.root.error;
export const selectDialogImageState = (state: AppState) =>
  state.root.dialogImage;
export const selectLoadingState = (state: AppState) => state.root.loading;
export const selectLoadingMessageState = (state: AppState) =>
  state.root.loadingMessage;
export const selectThemeModeState = (state: AppState) => state.root.themeMode;
export default rootSlice.reducer;
