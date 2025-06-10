import React from 'react'
import ListProductDeal from './Product/Dealoftheday/ListProductDeal'
import Baner from '../components/Baner/Baner'
import TopSale from './Product/TopSale/TopSale'
import BestSellers from './Product/BestSellers/BestSellers'
import SeviceDV from './SeviceDV/SeviceDV'

const HomePage = () => {
  return (
    <div>
      <Baner/>
      <ListProductDeal/>
      <TopSale/>
      <BestSellers/>
      <SeviceDV/>
    </div>
  )
}

export default HomePage
