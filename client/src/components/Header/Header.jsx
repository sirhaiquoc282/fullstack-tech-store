import React from "react";

import HeaderTop from "./HeaderTop/HeaderTop";

import HeaderBotton from "./HeaderBotton/HeaderBotton";


const Header = () => {
  return (
    
      <header>
        <div className="sticky top-0 z-50 bg-white shadow">
          <HeaderTop/>

          <HeaderBotton />
        </div>
      </header>
   
  );
};

export default Header;
