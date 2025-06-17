import React, { useState, useEffect } from "react";
import HeaderTop from "./HeaderTop/HeaderTop";
import HeaderBotton from "./HeaderBotton/HeaderBotton";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowHeader(false); // Cuộn xuống -> ẩn
      } else {
        setShowHeader(true); // Cuộn lên -> hiện
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div>
        <HeaderTop />
        <HeaderBotton />
      </div>
    </header>
  );
};

export default Header;
