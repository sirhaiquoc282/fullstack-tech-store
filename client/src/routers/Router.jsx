import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import HomePage from "../pages/HomePage";
import ProductDetailTop from "../pages/ProductDetail/ProductDetailTop";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import PageProducts from "../pages/pageProducts/PageProducts";
import Login from "../pages/Login";
import Cart from "../pages/Cart/Cart";
import WishList from "../pages/WishList/WishList";
import CheckOut from "../pages/CheckOut/CheckOut";
import Contact from "../pages/Contact/Contact";
import Profile from "../pages/Profile/Profile";
import ChangePass from "../pages/ChangePass";
import Register from "../pages/Register";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "product",
        element: <h1>product</h1> ,
      },
      {
        path: "shop",
        element: <PageProducts />,
      },
      {
        path: "product/:id",
        element: <ProductDetail/>,
      },
      {
        path :"login",
        element : <Login/>
      },
      {
        path : "carts",
        element : <Cart/>
      },
      {
        path : "wishs",
        element : <WishList/>
      },
      {
        path : "checkout",
        element : <CheckOut/>
      },
      {
        path : "contact",
        element : <Contact/>
      },
      {
        path : "profile",
        element : <Profile/>
      },{
        path : "changepass",
        element : <ChangePass/>
      },
      {
        path : "register",
        element : <Register/>
      }
    ],
  },
]);

export default Router;
