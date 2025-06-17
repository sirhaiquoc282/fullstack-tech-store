import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../../store/features/CartSlice";
import { addWishList } from "../../../../store/features/WishListSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BoxTopSale = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector((state) => state.authenSlice.isLogin);

  const handleAddToCart = (product) => {
    if (isLogin) {
      dispatch(
        addToCart({
          // ...product,
          productId: product.id,
          quantity: 1,
        })
      );
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } else {
      navigate("/login");
    }
  };

  const handleAddToWishList = (product) => {
    if (isLogin) {
      dispatch(addWishList(product));
      toast.success("Đã thêm sản phẩm vào yêu thích");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex gap-3">
      <div>
        <img
          className="w-28 h-auto object-contain"
          src={item.thumbnail}
          alt={item.title}
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col w-full max-w-[300px]">
          <button
            onClick={() => navigate(`/product/${item.id}`)}
            className="font-bold text-blue-700 hover:text-red-600 text-left cursor-pointer transition-all duration-150 hover:duration-700 line-clamp-1"
          >
            {item.title}
          </button>
          <p className="font-semibold text-sm text-gray-600 line-clamp-1">
            {item.description}
          </p>

          <span className="text-xl font-bold text-red-600">
            <span className="mr-4 text-red-600 text-2xl font-semibold">
              {(
                item.price -
                (item.price * item.discountPercentage) / 100
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>
          </span>
          {item.discountPercentage && (
            <span className="mr-4 text-gray-400 text-xl font-semibold line-through">
              {(
                item.price 
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>
          )}
        </div>
        <ul className="flex gap-5 p-2 rounded-md shadow-inherit">
          <li>
            <button onClick={() => handleAddToCart(item)}>
              <i className="fas fa-shopping-bag fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
            </button>
          </li>
          <li>
            <button onClick={() => handleAddToWishList(item)}>
              <i className="far fa-heart fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
            </button>
          </li>
          <li>
            <button onClick={() => navigate(`/product/${item.id}`)}>
              <i className="far fa-eye fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BoxTopSale;
