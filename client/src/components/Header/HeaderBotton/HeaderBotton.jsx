import React from 'react'
import HeaderAuthen from './HeaderAuthen'
import HeaderMenu from './HeaderMenu'

const HeaderBotton = () => {
  return (
    <div className="bg-gray-100 py-4 mt-5 hidden xl:block"> {/* Màu nền nhẹ hơn, padding, ẩn trên mobile */}
      <div className="container mx-auto flex justify-between items-center px-4"> {/* Căn giữa container */}
        <HeaderMenu />
        <HeaderAuthen />
      </div>
    </div>
  )
}

export default HeaderBotton