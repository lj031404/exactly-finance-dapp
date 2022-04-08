import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
// Define a type for the slice state
interface UserInfoState {
  address: string;
  balance: number;
}

// Define the initial state using that type
const initialState: UserInfoState = {
  address: "",
  balance: 0,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getAddress: (state, { payload }) => {
      state.address = payload;
    },
    getBalance: (state, { payload }) => {
      state.balance = payload;
    },
  },
});

export const { getAddress, getBalance } = userInfoSlice.actions;

export default userInfoSlice.reducer;
