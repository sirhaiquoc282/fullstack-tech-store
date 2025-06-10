import React from 'react'
import banner from '../../assets/img/banner-7.jpg'

const BanerRight = () => {
  return (
    <div className="lg:col-span-3 w-full">
            <img
              src={banner}
              alt="Product"
              className="w-full h-auto rounded-lg shadow"
            />
          </div>
  )
}

export default BanerRight
