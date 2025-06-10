import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishItems: [], // đúng tên biến đang dùng
};

export const wishListSlice = createSlice({
  name: "wishListSlice",
  initialState,
  reducers: {
    addWishList: (state, action) => {
      const { payload } = action;
      const isExist = state.wishItems.some((item) => item.id === payload.id);

      if (!isExist) {
        state.wishItems.push(payload);
      }
      // nếu sản phẩm đã tồn tại thì không thêm nữa
    },
    deleteWishList: (state, action) => {
      const { payload } = action;
      const { wishItems } = state;
      const updateWish = wishItems.filter(
        (item) => item.id != action.payload.id
      );
      return {
        ...state,
        wishItems: updateWish,
      };
    },
  },
});

export const { addWishList, deleteWishList } = wishListSlice.actions;
export default wishListSlice.reducer;
