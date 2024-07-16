import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast"

const initialState = {
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setTotalItems (state, action) {
      state.token = action.payload;
      },
      //add to cart
      //remove to cart
      //reset cart
  },
});

export const { setTotalItems } = cartSlice.actions;
export default cartSlice.reducer;
