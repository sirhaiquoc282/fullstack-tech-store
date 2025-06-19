import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../../store/features/CartSlice";
import { addWishList } from "../../../../store/features/WishListSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BoxTopSale = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.authenSlice.isLogin);

  const handleAddToCart = (product) => {
    if (isLogin) {
      dispatch(
        addToCart({
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
    <motion.div
      className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative">
        <img
          className="w-24 h-24 object-contain rounded-lg border border-gray-200"
          src={item.thumbnail}
          alt={item.title}
        />
        {item.discountPercentage > 0 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full transform translate-x-1/2 -translate-y-1/2">
            -{Math.round(item.discountPercentage)}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <div className="mb-2">
          <button
            onClick={() => navigate(`/product/${item.id}`)}
            className="font-bold text-gray-800 hover:text-blue-600 text-left cursor-pointer transition-colors duration-200 text-base line-clamp-1"
          >
            {item.title}
          </button>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-600 font-bold text-lg">
              {(
                item.price -
                (item.price * item.discountPercentage) / 100
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>
            {item.discountPercentage > 0 && (
              <span className="block text-gray-400 text-sm line-through">
                {item.price.toLocaleString("vi-VN")} VNĐ
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => handleAddToCart(item)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fas fa-shopping-cart text-xs"></i>
            </motion.button>

            <motion.button
              onClick={() => handleAddToWishList(item)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            >
              <i className="far fa-heart text-xs"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BoxTopSale;