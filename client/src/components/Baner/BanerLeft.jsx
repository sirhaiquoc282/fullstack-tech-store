import React, { useEffect, useState } from "react";
import apiService from "../../service/apiService";
import { useNavigate } from "react-router-dom";

const BanerLeft = () => {
  const navigate = useNavigate();
  const [listCategories, setListCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  useEffect(() => {
    const fetchListProduct = async () => {
      const res = await apiService.getListCategories();
      if (res.status === 200) {
        setListCategories(res.data);
      }
    };

    fetchListProduct();
  }, []);

  const handleClick = (item) => {
    setActiveCategory(item);

    navigate("/shop", { state: { category: item } });
  };

  return (
    <div className="border rounded-lg hidden lg:block">
      <h2 className="bg-red-600 text-white font-bold px-6 py-3 rounded-t-lg flex items-center gap-5">
        <i className="fas fa-bars"></i>
        <p>All departments</p>
      </h2>

      <div
        className={`flex flex-col gap-2 py-3 ${
          listCategories.length > 16 ? "max-h-[650px] overflow-y-auto" : ""
        }`}
      >
        {listCategories?.map((item, index) => (
          <div key={index}>
            <button
              className={`w-full text-left px-4 py-2 flex items-center gap-5 transition ${
                activeCategory === item
                  ? "text-red-600 font-bold" // style khi active
                  : "hover:text-red-600 text-black" // style mặc định
              }`}
              onClick={() => handleClick(item)}
            >
              <p>{item}</p>
            </button>
            <hr className="mx-4 border" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BanerLeft;
