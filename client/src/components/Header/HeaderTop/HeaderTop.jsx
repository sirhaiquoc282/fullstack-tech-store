import React, { useState, useEffect } from "react";
import Headerlogo from "./Headerlogo";
import HeaderSeach from "./HeaderSeach";
import HeaderTT from "./HeaderTT";
import { Link } from "react-router-dom";
import apiService from "../../../service/apiService";
import { useNavigate } from "react-router-dom";

const HeaderTop = () => {
  const [visible, setVisible] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
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
    setVisible(false);

    navigate("/shop", { state: { category: item } });
  };



  return (
    <>
      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between container">
        <Headerlogo />
        <div className="hidden md:block">
          <HeaderSeach />
        </div>
        <div className="hidden xl:block">
          <HeaderTT />
        </div>
        <div className="flex items-center gap-4 xl:hidden ml-2">
          {/* User Icon */}
          <div className="relative group">
            <i className="far fa-user fa-lg text-gray-600 cursor-pointer"></i>
            <div className="group-hover:block hidden absolute right-0 top-6 pt-2 z-10">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md">
                <p className="cursor-pointer hover:text-red-500 hover:border-b hover:border-red-500">
                  My Profile
                </p>
                <p className="cursor-pointer hover:text-red-500 hover:border-b hover:border-red-500">
                  Order
                </p>
                <p className="cursor-pointer hover:text-red-500 hover:border-b hover:border-red-500">
                  Logout
                </p>
              </div>
            </div>
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <Link to="/shop/cart">
              <i className="fas fa-shopping-cart fa-lg text-gray-600"></i>
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                21
              </div>
            </Link>
          </div>

          {/* Hamburger */}
          <div onClick={() => setVisible(true)}>
            <i className="fas fa-bars fa-lg text-gray-600 cursor-pointer"></i>
          </div>
        </div>
      </div>

      {/* --- Overlay --- */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${visible ? "translate-x-0" : "translate-x-full"
          } w-[320px] shadow-lg`}
      >
        {/* Close Button */}
        <div className="text-right p-4 border-b">
          <button onClick={() => setVisible(false)}>
            <i className="fas fa-times text-xl text-gray-700"></i>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-5">
          <div className="flex justify-between border rounded-xl px-6 py-2">
            <a
              className={`cursor-pointer ${!showCategories ? "text-red-600 font-bold" : ""
                }`}
              onClick={() => setShowCategories(false)}
            >
              Menu
            </a>
            <a
              className={`cursor-pointer ${showCategories ? "text-red-600 font-bold" : ""
                }`}
              onClick={() => setShowCategories(true)}
            >
              Categories
            </a>
          </div>

          {!showCategories && (
            <ul className="flex flex-col gap-4 text-gray-700 font-semibold mt-4">
              <li className="md:hidden block">
                <HeaderSeach />
              </li>
              <li>
                <Link to="/" onClick={() => setVisible(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" onClick={() => setVisible(false)}>
                  Shop
                </Link>
              </li>

              <li>
                <Link to="/contact" onClick={() => setVisible(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          )}

          {/* Categories List - Hiện khi ở trạng thái Categories */}
          {showCategories && (
            <div
              className={`flex flex-col gap-2 py-3 ${listCategories.length > 16
                ? "max-h-[650px] overflow-y-auto"
                : ""
                }`}
            >
              {listCategories?.map((item, index) => (
                <div key={index}>
                  <button
                    className={`w-full text-left px-4 py-2 flex items-center gap-5 transition ${activeCategory === item
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
          )}
        </div>
      </div>

      <hr className="mt-6 xl:hidden" />
    </>
  );
};

export default HeaderTop;
