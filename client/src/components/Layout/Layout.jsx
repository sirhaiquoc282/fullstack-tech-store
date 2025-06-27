import React, {useEffect} from 'react'
import { Outlet} from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCartAPI } from '../../store/features/CartSlice'
import { fetchWishList } from '../../store/features/WishListSlice'
const Layout = () => {
  const isLogin = useSelector((state) => state.authenSlice.isLogin);
const dispatch = useDispatch();

useEffect(() => {
  if (isLogin) {
    dispatch(fetchCartAPI()); 
  }
}, [isLogin]);
    useEffect(() => {
      if (isLogin) {
        dispatch(fetchWishList());       
      }
    }, [isLogin]);
  return (
    <div>
      <Header/>
      <main className='pt-[200px]'>
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}

export default Layout