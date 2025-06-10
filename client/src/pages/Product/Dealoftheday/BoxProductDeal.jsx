import React from "react";
import { useNavigate } from "react-router-dom";

const BoxProductDeal = ({ item }) => {
  const navigate = useNavigate();
  
  return (
    <div className="border border-gray-200 rounded-xl shadow-current hover:shadow-lg">
      <div className="flex items-center justify-center">
        <div className="w-[247px] p-2 ">
          <img
            className="w-full h-full object-cover"
            src={item.images}
            alt={item.name}
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 items-center justify-center">
          {item.thumbnails?.map((thumb, idx) => (
            <div
              key={idx}
              className="w-[48px] h-[48px] p-1 border-[1px]  border-gray-200 rounded-lg m-2"
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
        <a onClick={()=>navigate(`/product/${item.id}`)} className="cursor-pointer text-blue-600 font-semibold hover:text-red-600 text-lg line-clamp-2">
          {item.description}
        </a>
        <p className="mt-4 flex">
          <span className="mr-4 text-red-600 text-3xl font-semibold">
            ${item.price}
          </span>
          {item.discount && (
            <span className="bg-red-700 rounded-full px-3 py-1 text-white font-medium">
              Save: ${item.discount}
            </span>
          )}
        </p>

        {/* TIME */}
        <div className="mt-4 flex gap-3 items-center justify-center mb-3">
          {["Days", "Hours", "Mins", "Secs"].map((label, i) => (
            <span key={i} className="flex flex-col">
              <span className="rounded-full bg-slate-200 flex items-center justify-center font-medium text-gray-500 p-4 w-10 h-10">
                01
              </span>
              <span className="font-medium text-gray-600">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxProductDeal;
