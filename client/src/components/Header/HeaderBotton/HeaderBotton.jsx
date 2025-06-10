import React from 'react'
import HeaderAuthen from './HeaderAuthen'
import HeaderMenu from './HeaderMenu'

const HeaderBotton = () => {
  return (
    <div className="bg-[#b7b7b8] mt-5 py-4 xl:block hidden">
            <div className="container flex justify-between items-center">
             <HeaderMenu/>
              <HeaderAuthen/>
            </div>
          </div>
  )
}

export default HeaderBotton
