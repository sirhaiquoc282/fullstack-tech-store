import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CoundownTimer"
const BoxProductDeal = ({ item }) => {
  const [mainImg, setMainImg] = useState(item.thumbnail); 
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 rounded-xl shadow-current hover:shadow-lg">
      <div className="flex flex-col items-center justify-center">
        {/* Ảnh chính */}
        <div className="w-[247px] h-[180px] p-2">
          <img
            className="w-full h-full object-contain"
            src={mainImg}
            alt={item.name}
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 items-center justify-center">
          {item.images?.slice(0, 4).map((thumb, idx) => (
            <div
              key={idx}
              className="w-[48px] h-[48px] p-1 border-[1px] border-gray-200 rounded-lg m-2 cursor-pointer hover:border-red-400"
              onClick={() => setMainImg(thumb)}
            >
              <img
                className="w-full h-full object-cover"
                src={thumb}
                alt={`thumb-${idx}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 mx-4">
        <a
          onClick={() => navigate(`/product/${item.id}`)}
          className="cursor-pointer text-blue-600 font-semibold hover:text-red-600 text-lg line-clamp-2"
        >
          {item.description}
        </a>

        <p className="mt-4 flex items-center">
          <span className="mr-4 text-red-600 text-2xl font-semibold">
            {(
              item.price -
              (item.price * item.discountPercentage) / 100
            ).toLocaleString("vi-VN", {
              maximumFractionDigits: 0,
            })}{" "}
            VNĐ
          </span>

          {item.discountPercentage && (
            <span className="bg-red-700 rounded-full px-3 py-1 text-white font-medium text-sm">
              -{item.discountPercentage}%
            </span>
          )}
        </p>

        <CountdownTimer/>
       
      </div>
    </div>
  );
};

export default BoxProductDeal;
