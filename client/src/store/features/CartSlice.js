import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// Các asyncThunk đã đúng
export const fetchCartAPI = createAsyncThunk("cart/fetch", async () => {
  const response = await axiosInstance.get("/cart");
  return response.data;
});

export const addToCart = createAsyncThunk("cart/add", async (product) => {
  console.log(product);
  
  const response = await axiosInstance.post("/cart", product);  
  return response.data;
});

export const updateCartAPI = createAsyncThunk("cart/update", async (product) => {
  const response = await axiosInstance.put("/cart", product);
  return response.data;
});

export const deleteCartAPI = createAsyncThunk("cart/delete", async (productId) => {
  await axiosInstance.delete(`/cart/${productId}`);
  return productId;
});


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartAPI.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existing = state.cartItems.find((item) => item.id === newItem.id);
        if (existing) {
          state.cartItems = state.cartItems.map((item) =>
            item.id === newItem.id ? newItem : item
          );
        } else {
          state.cartItems.push(newItem);
        }
      })
      .addCase(updateCartAPI.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        state.cartItems = state.cartItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
      })
      .addCase(deleteCartAPI.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});


export default cartSlice.reducer;
