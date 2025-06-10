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
          ...product,
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
          src={item.images}
          alt={item.title}
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col w-full max-w-[300px]">
          <p className="font-semibold text-sm text-gray-400">{item.category}</p>
          <button
            onClick={() => navigate(`/product/${item.id}`)}
            className="font-bold text-blue-700 hover:text-red-600 text-left cursor-pointer transition-all duration-150 hover:duration-700 line-clamp-2"
          >
            {item.title}
          </button>
          <span className="text-xl font-bold text-red-600">${item.price}</span>
          {item.discountPercentage && (
            <span className="line-through text-base font-semibold text-gray-400">
              ${(item.price * (1 + item.discountPercentage / 100)).toFixed(2)}
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
