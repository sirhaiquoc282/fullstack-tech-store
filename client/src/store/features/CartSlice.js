import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// Các asyncThunk đã đúng
export const fetchCartAPI = createAsyncThunk("cart/fetch", async () => {
  const response = await axiosInstance.get("/cart/");
  console.log("📦 Fetch Cart response:", response.data.products);
  return response.data.products;
});

export const addToCart = createAsyncThunk("cart/add", async (product) => {
  const response = await axiosInstance.post("/cart/", product);
  return response.data;
});

export const updateCartAPI = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }) => {
    const response = await axiosInstance.put("/cart", {
      productId,
      newQuantity: quantity,
    });
    console.log("updateCartAPI response:", response.data);
    return response.data.cart.products;
  }
);

export const deleteCartAPI = createAsyncThunk(
  "cart/delete",
  async (productId) => {
    await axiosInstance.delete(`/cart/${productId}`);
    return productId;
  }
);

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
        // Chỉ giữ lại những sản phẩm còn tồn tại
        state.cartItems = action.payload.filter(
          (item) => item.productId && item.productId._id
        );
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
        const updatedCart = action.payload; // Đây là mảng products
        state.cartItems = updatedCart;
      })

      .addCase(deleteCartAPI.fulfilled, (state, action) => {
        const deletedProductId = action.payload;
        state.cartItems = state.cartItems.filter(
          (item) => item.productId && item.productId._id !== action.payload
        );
      });
  },
});

export default cartSlice.reducer;
