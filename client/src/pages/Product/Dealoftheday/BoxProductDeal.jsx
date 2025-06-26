import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiStar } from "react-icons/fi"; // Import icons for cart and star ratings

import CountdownTimer from "./CoundownTimer"; // Assuming this component is also translated or handles its own language

const BoxProductDeal = ({ item }) => {
  const [mainImg, setMainImg] = useState(item.thumbnail);
  const navigate = useNavigate();

  // Mock data for sold count and percentage
  const soldCount = Math.floor(Math.random() * 50) + 10;
  const soldPercentage = Math.floor(Math.random() * 60) + 40; // Represents percentage sold

  return (
    <motion.div
      className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg overflow-hidden bg-white"
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        y: -5
      }}
      transition={{ duration: 0.3 }}
    >
      {/* "Deal Hot" Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          HOT DEAL
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
            key={mainImg} // Key prop to force re-render when mainImg changes for animation
            className="w-full h-full object-contain"
            src={mainImg}
            alt={item.title} // Use item.title for alt text
            initial={{ opacity: 0 }} // Initial animation state
            animate={{ opacity: 1 }} // Animation target state
            transition={{ duration: 0.3 }} // Animation duration
          />
        </motion.div>

        {/* Thumbnails */}
        <div className="flex gap-2 items-center justify-center mt-4 px-4">
          {/* Slice to ensure only up to 4 thumbnails are displayed */}
          {item.images?.slice(0, 4).map((thumb, idx) => (
            <motion.div
              key={idx} // Using index as key for now, if thumbnails have unique IDs, use them
              className={`w-10 h-10 p-1 rounded-lg border cursor-pointer overflow-hidden ${mainImg === thumb
                ? "border-red-500 shadow-inner bg-red-50" // Active thumbnail style
                : "border-gray-200 hover:border-red-300" // Default thumbnail style
                }`}
              onClick={() => setMainImg(thumb)} // Change main image on thumbnail click
              whileHover={{ scale: 1.1 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Slightly shrink on tap/click
            >
              <img
                className="w-full h-full object-cover"
                src={thumb}
                alt={`${item.title} thumbnail ${idx + 1}`} // Descriptive alt text
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
              // Display stars based on product rating
              <FiStar // Using FiStar from react-icons
                key={i}
                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" // Ensures the icon is filled
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-red-600 text-xl font-bold">
              {/* Calculate discounted price and format */}
              {(
                item.price -
                (item.price * item.discountPercentage) / 100
              ).toLocaleString("en-US", { // Changed to en-US for English formatting
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ {/* Currency remains VNĐ or change to USD/local currency */}
            </span>

            {item.discountPercentage > 0 && (
              <div className="flex items-center mt-1">
                <span className="text-gray-400 text-sm line-through mr-2">
                  {item.price.toLocaleString("en-US")} VNĐ
                </span>
                <span className="bg-red-100 text-red-700 rounded px-2 py-0.5 text-xs font-medium">
                  -{Math.round(item.discountPercentage)}%
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className="bg-gray-100 hover:bg-red-600 text-gray-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            aria-label="Add to cart"
          // You'll need to add onClick handler for addToCart action here
          // e.g., onClick={() => handleAddToCart(item)}
          >
            <FiShoppingCart className="text-sm" /> {/* Replaced Font Awesome with FiShoppingCart */}
          </button>
        </div>

        {/* Countdown Timer */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Ends in:</p>
          <CountdownTimer className="text-xs" /> {/* Ensure CountdownTimer also handles English */}

          {/* Sold progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Sold: {soldCount}</span>
              <span>Remaining: {Math.floor(soldCount * 1.5)}</span> {/* Adjusted "Còn lại" */}
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