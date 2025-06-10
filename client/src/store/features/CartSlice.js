import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1, ...rest } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        const updatedCart = state.cartItems.map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity > 0 ? newQuantity : 1, 
            };
          }
          return item;
        });
        return {
          ...state,
          cartItems: updatedCart,
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { ...rest, id, quantity: quantity > 0 ? quantity : 1 }],
      };
    },

    deleteCart: (state, action) => {
      const id = action.payload;
      const updatedCart = state.cartItems.filter((item) => item.id !== id);
      return {
        ...state,
        cartItems: updatedCart,
      };
    },
  },
});

export const { addToCart, deleteCart } = cartSlice.actions;
export default cartSlice.reducer;
