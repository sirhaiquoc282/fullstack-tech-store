import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AccountMenu from "./MenuAccount"; // Đảm bảo đường dẫn đúng

const HeaderAuthen = () => {
  // Giả định cartItems và wishItems có thuộc tính `length`
  const cartItems = useSelector((state) => state.cartSlice.cartItems || []);
  const wishItems = useSelector((state) => state.WishListSlice.wishItems || []);
  // Kiểm tra isLogin thông qua user object (nếu có) hoặc flag isLogin
  const isLogin = useSelector((state) => state.authenSlice.isLogin); // Dùng isLogin từ slice

  const navigate = useNavigate();

  const handleGoToWish = () => {
    if (isLogin) {
      navigate("/wishlist"); // Điều hướng đến trang wishlist
    } else {
      toast.warning("Vui lòng đăng nhập để xem danh sách yêu thích!", { theme: "colored" });
      navigate("/login");
    }
  };

  const handleGoToCart = () => {
    if (isLogin) {
      navigate("/carts");
    } else {
      toast.warning("Vui lòng đăng nhập để xem giỏ hàng!", { theme: "colored" });
      navigate("/login");
    }
  };

  return (
    <ul className="flex items-center space-x-6 lg:space-x-8"> {/* Khoảng cách lớn hơn */}
      {/* User Icon / Account Menu */}
      <li className="
                relative flex items-center justify-center
                group transition-transform duration-300 ease-in-out
                hover:scale-110 /* Phóng to nhẹ khi hover */
                text-gray-700 hover:text-red-700 /* Màu sắc khi hover */
                cursor-pointer
            ">
        {isLogin ? (
          <AccountMenu />
        ) : (
          <Link to={"/login"} className="block"> {/* block để đảm bảo kích thước hit area */}
            <i className="far fa-user fa-lg"></i> {/* Font Awesome user icon */}
          </Link>
        )}
      </li>

      {/* Wishlist Icon */}
      <li
        onClick={handleGoToWish}
        className="
                    relative flex items-center justify-center
                    group transition-transform duration-300 ease-in-out
                    hover:scale-110 /* Phóng to nhẹ khi hover */
                    text-gray-700 hover:text-red-700 /* Màu sắc khi hover */
                    cursor-pointer
                "
      >
        <i className="far fa-heart fa-lg"></i> {/* Font Awesome heart icon */}
        {wishItems.length > 0 && ( /* Chỉ hiển thị badge nếu có item */
          <div className="
                        absolute -top-2 -right-2 bg-red-600 text-white
                        text-xs font-semibold w-5 h-5 rounded-full
                        flex items-center justify-center
                        border border-white /* Viền trắng để nổi bật */
                        pointer-events-none /* Ngăn không cho badge chặn click */
                    ">
            <span>{wishItems.length}</span>
          </div>
        )}
      </li>

      {/* Cart Icon */}
      <li
        onClick={handleGoToCart}
        className="
                    relative flex items-center justify-center
                    group transition-transform duration-300 ease-in-out
                    hover:scale-110 /* Phóng to nhẹ khi hover */
                    text-gray-700 hover:text-red-700 /* Màu sắc khi hover */
                    cursor-pointer
                "
      >
        <i className="fas fa-shopping-cart fa-lg"></i> {/* Font Awesome cart icon */}
        {cartItems.length > 0 && ( /* Chỉ hiển thị badge nếu có item */
          <div className="
                        absolute -top-2 -right-2 bg-red-600 text-white
                        text-xs font-semibold w-5 h-5 rounded-full
                        flex items-center justify-center
                        border border-white /* Viền trắng để nổi bật */
                        pointer-events-none /* Ngăn không cho badge chặn click */
                    ">
            <span>{cartItems.length}</span>
          </div>
        )}
      </li>
    </ul>
  );
};

export default HeaderAuthen;