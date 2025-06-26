import React from 'react'
import ListProductDeal from './Product/Dealoftheday/ListProductDeal'
import Baner from '../components/Baner/Baner'
import TopSale from './Product/TopSale/TopSale'
import Camera from './Product/Camera/Camera'
import SeviceDV from './SeviceDV/SeviceDV'

const HomePage = () => {
  return (
    <div>
      <Baner />
      <ListProductDeal />
      <TopSale />
      <Camera />
      <SeviceDV />
    </div>
  )
}

export default HomePage
