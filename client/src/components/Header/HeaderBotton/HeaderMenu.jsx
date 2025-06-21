import React from "react";
import { NavLink } from "react-router-dom";

const HeaderMenu = () => {
  const listMenu = [
    { title: "Home", to: "/" },
    { title: "Shop", to: "/shop" },
    // { title: "Sản phẩm", to: "/product" }, // Đã bị thiếu title, nếu muốn dùng thì thêm title
    { title: "Contract", to: "/contact" },
  ];

  return (
    <nav className="text-gray-700 font-semibold"> {/* Màu chữ chung */}
      <ul className="flex items-center space-x-8 lg:space-x-10"> {/* Khoảng cách giữa các menu item */}
        {listMenu.map((item, index) => (
          <li
            key={index}
            className="
                            relative flex items-center
                            group transition-transform duration-300 ease-in-out /* Smooth transition for scale */
                            hover:scale-110 /* Phóng to nhẹ khi hover */
                            text-gray-700 hover:text-red-700 /* Màu sắc khi hover */
                            cursor-pointer
                        "
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `relative transition-colors duration-200 ease-in-out
                                ${isActive
                  ? "text-red-700 after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-700" /* Active state with underline */
                  : "hover:text-red-700" /* Hover state */
                }`
              }
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderMenu;