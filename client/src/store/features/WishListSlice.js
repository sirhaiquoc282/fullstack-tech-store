// store/features/WishListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// Lấy danh sách yêu thích từ API
export const fetchWishList = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/wishlist/");
      return res.data.products; // ✅ CHỈ lấy mảng sản phẩm
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi fetch wishlist"
      );
    }
  }
);

// Thêm sản phẩm vào yêu thích
export const addWishList = createAsyncThunk(
  "wishlist/add",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/wishlist/", {
        productId: product.id,
      });
      return product;
    } catch (err) {
      return rejectWithValue("Thêm sản phẩm vào yêu thích thất bại");
    }
  }
);

// Xoá sản phẩm khỏi yêu thích
export const deleteWishListItem = createAsyncThunk(
  "wishlist/delete",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue("Xoá sản phẩm khỏi yêu thích thất bại");
    }
  }
);

const initialState = {
  wishItems: [],
  loading: false,
  error: null,
};

const wishListSlice = createSlice({
  name: "WishListSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishItems = action.payload || [];
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addWishList.fulfilled, (state, action) => {
        const exists = state.wishItems.some(
          (item) => item.id === action.payload.id
        );
        if (!exists) {
          state.wishItems.push(action.payload);
        }
      })

      .addCase(deleteWishListItem.fulfilled, (state, action) => {
        const productId = action.payload;
        state.wishItems = state.wishItems.filter(
          (item) => item.id !== productId && item._id !== productId
        );
      });
  },
});

export default wishListSlice.reducer;