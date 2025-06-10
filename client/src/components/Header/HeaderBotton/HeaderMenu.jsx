import React from "react";
import { NavLink } from "react-router-dom";

const HeaderMenu = () => {
  const listMenu = [
    {
      title: "Home",
      to: "/",
    },
    {
      title: "Shop",
      to: "/shop",
    },
    {
      
      to: "/product",
    },
    {
      title: "Contact",
      to: "/contact",
    },
  ];

  return (
    <nav className="text-[#48484a] font-semibold">
      <ul className="flex gap-6">
        {listMenu.map((item) => (
          <li className="hover:text-[#FF3D3D] cursor-pointer hover:scale-125 hover:transition-all duration-0 hover:duration-400 relative">
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
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
