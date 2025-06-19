import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CoundownTimer";
import { motion } from "framer-motion";

const BoxProductDeal = ({ item }) => {
  const [mainImg, setMainImg] = useState(item.thumbnail);
  const navigate = useNavigate();

  const soldCount = Math.floor(Math.random() * 50) + 10;
  const soldPercentage = Math.floor(Math.random() * 60) + 40;

  return (
    <motion.div
      className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg overflow-hidden bg-white"
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        y: -5
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Badge Deal Hot */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          DEAL HOT
        </div>
      </div>

      {/* Image Section */}
      <div className="relative flex flex-col items-center justify-center pt-6 pb-3 bg-white">
        <motion.div
          className="w-[200px] h-[150px] p-2 cursor-pointer relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(`/product/${item.id}`)}
        >
          <motion.img
            key={mainImg}
            className="w-full h-full object-contain"
            src={mainImg}
            alt={item.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Thumbnails */}
        <div className="flex gap-2 items-center justify-center mt-4 px-4">
          {item.images?.slice(0, 4).map((thumb, idx) => (
            <motion.div
              key={idx}
              className={`w-10 h-10 p-1 rounded-lg border cursor-pointer overflow-hidden ${mainImg === thumb
                ? "border-red-500 shadow-inner bg-red-50"
                : "border-gray-200 hover:border-red-300"
                }`}
              onClick={() => setMainImg(thumb)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                className="w-full h-full object-cover"
                src={thumb}
                alt={`thumb-${idx}`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 border-t border-gray-100">
        <a
          onClick={() => navigate(`/product/${item.id}`)}
          className="block cursor-pointer font-bold text-gray-800 hover:text-red-600 text-base mb-2 line-clamp-2 transition-colors"
        >
          {item.title}
        </a>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-red-600 text-xl font-bold">
              {(
                item.price -
                (item.price * item.discountPercentage) / 100
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>

            {item.discountPercentage > 0 && (
              <div className="flex items-center mt-1">
                <span className="text-gray-400 text-sm line-through mr-2">
                  {item.price.toLocaleString("vi-VN")} VNĐ
                </span>
                <span className="bg-red-100 text-red-700 rounded px-2 py-0.5 text-xs font-medium">
                  -{Math.round(item.discountPercentage)}%
                </span>
              </div>
            )}
          </div>

          <button
            className="bg-gray-100 hover:bg-red-600 text-gray-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            aria-label="Add to cart"
          >
            <i className="fas fa-shopping-cart text-sm"></i>
          </button>
        </div>

        {/* Countdown Timer */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Kết thúc sau:</p>
          <CountdownTimer className="text-xs" />

          {/* Thanh đã bán */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Đã bán: {soldCount}</span>
              <span>Còn lại: {Math.floor(soldCount * 1.5)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BoxProductDeal;