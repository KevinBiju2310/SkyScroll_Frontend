import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Dispatching user:", action.payload);
      state.user = action.payload;
    },
    updateUserProfile: (state, action) => {
      console.log("Updating user profile:", action.payload);
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout, updateUserProfile } = userSlice.actions;

export default userSlice.reducer;
