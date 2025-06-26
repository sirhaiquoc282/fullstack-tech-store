import React from 'react'
import ListProductDeal from './Product/Dealoftheday/ListProductDeal'
import Banner from '../components/Banner/Banner.jsx'
import Camera from './Product/Camera/Camera'
import Laptop from './Product/Laptop/Laptop.jsx'
import Smartphone from './Product/Smartphone/Smartphone'
import Smartwatch from './Product/Smartwatch/Smartwatch'
import Tablet from './Product/Tablet/Tablet'
import SeviceDV from './SeviceDV/SeviceDV'


const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Banner />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ListProductDeal />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Laptop />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Smartphone />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Tablet />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Smartwatch />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Camera />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <SeviceDV />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage