import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user details
  userJoinedClubs: [], // Stores user's joined clubs
  userRequestClubs: [] // Stores user's club requests (PENDING, REJECTED, etc.)
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserJoinedClubs: (state, action) => {
      state.userJoinedClubs = action.payload;
    },
    setUserRequestedClubs: (state, action) => {
      state.userRequestClubs = action.payload;
    },
    updateUserRequests: (state, action) => {
      // Update only the specific club's request status
      const updatedRequests = state.userRequestClubs.map(req =>
        req.clubId === action.payload.clubId ? action.payload : req
      );

      // If it's a new request, add it
      if (!updatedRequests.some(req => req.clubId === action.payload.clubId)) {
        updatedRequests.push(action.payload);
      }

      state.userRequestClubs = updatedRequests;
    },
    logoutUser: (state) => {
      state.user = null;
      state.userJoinedClubs = [];
      state.userRequestClubs = [];
    }
  },
});

export const { setUser, setUserJoinedClubs, setUserRequestedClubs, updateUserRequests, logoutUser } = userSlice.actions;
export default userSlice.reducer;