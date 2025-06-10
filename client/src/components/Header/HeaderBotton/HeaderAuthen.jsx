import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AccountMenu from "./MenuAccount";

const HeaderAuthen = () => {
  const cartItems = useSelector((state) => state.cartSlice.cartItems);
  const wishItems = useSelector((state) => state.WishListSlice.wishItems);
  const { isLogin } = useSelector((state) => state.authenSlice);
  const navigate = useNavigate();

  const handleGoToWish = () => {
    if (isLogin) {
      navigate("/wish");
    } else {
      toast.warning("Vui lòng đăng nhập để xem danh sách yêu thích");
      navigate("/login");
    }
  };

  const handleGoToCart = () => {
    if (isLogin) {
      navigate("/carts");
    } else {
      toast.warning("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login");
    }
  };

  return (
    <div>
      <ul className="flex gap-6 items-center">
        <li className="hover:text-[#FF3D3D] group cursor-pointer hover:scale-125 hover:transition-all duration-0 hover:duration-800 relative">
          {isLogin ? (
            <AccountMenu />
          ) : (
            <Link to={"login"}>
              <i className="far fa-user fa-lg"></i>
            </Link>
          )}
        </li>

        <li
          onClick={handleGoToWish}
          className="hover:text-[#FF3D3D] cursor-pointer hover:scale-125 hover:transition-all duration-0 hover:duration-800 relative"
        >
          <i className="far fa-heart fa-lg"></i>
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center">
            <span>{wishItems.length}</span>
          </div>
        </li>

        <li
          onClick={handleGoToCart}
          className="hover:text-[#FF3D3D] cursor-pointer hover:scale-125 hover:transition-all duration-0 hover:duration-800 relative"
        >
          <i className="fas fa-shopping-cart fa-lg"></i>
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center">
            <span>{cartItems.length}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default HeaderAuthen;
