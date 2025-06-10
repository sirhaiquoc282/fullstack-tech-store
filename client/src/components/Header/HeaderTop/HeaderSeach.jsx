import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn reload trang
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="border-2 border-black rounded-3xl px-0 py-1 items-start text-center">
      <form onSubmit={handleSubmit} className="flex items-center px-2 justify-between">
        <div className="flex">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:pr-40 xl:pr-56 focus:outline-none"
            type="text"
            placeholder="Search for products"
          />
          <div>
            <button
              type="submit"
              className="bg-[#FF3D3D] w-8 h-8 rounded-full flex items-center justify-center"
            >
              <i className="fas fa-search fa-lg text-white"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeaderSearch;
