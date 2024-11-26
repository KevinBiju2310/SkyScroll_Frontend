import { createSlice } from "@reduxjs/toolkit";

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
  },
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    updateBookingStatus: (state, action) => {
      const updatedBooking = action.payload;
      state.bookings = state.bookings.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      );
    },
  },
});

export const { setBookings, updateBookingStatus } = bookingsSlice.actions;
export default bookingsSlice.reducer;
