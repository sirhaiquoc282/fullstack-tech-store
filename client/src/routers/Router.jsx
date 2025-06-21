import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import HomePage from "../pages/HomePage";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import PageProducts from "../pages/pageProducts/PageProducts";
import Login from "../pages/Login";
import Cart from "../pages/Cart/Cart";
import WishList from "../pages/WishList/WishList";
import CheckOut from "../pages/CheckOut/CheckOut";
import Contact from "../pages/Contact/Contact";
import ChangePass from "../pages/ChangePass";
import Register from "../pages/Register";

import ProfileLayout from "../pages/Profile/ProfileLayout";
import ProfileDashboard from "../pages/Profile/Dashboard";
import ProfilePaymentMethods from "../pages/Profile/PaymentMethods";
import ProfileOrders from "../pages/Profile/Orders";
import ProfileReturns from "../pages/Profile/Returns";
import Profile from "../pages/Profile/Profile";
import ProfileSupport from "../pages/Profile/Support";
import ProfileAddresses from "../pages/Profile/Addresses";
import ProfileSettings from "../pages/Profile/Settings";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">
            We're sorry for the inconvenience. Please try refreshing the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <h1 className="text-2xl font-bold p-8">Products Page</h1>,
      },
      {
        path: "shop",
        element: <PageProducts />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "carts",
        element: <Cart />
      },
      {
        path: "wish",
        element: <WishList />
      },
      {
        path: "checkout",
        element: <CheckOut />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <ProfileDashboard />,
          },
          {
            path: "payment-methods",
            element: <ProfilePaymentMethods />,
          },
          {
            path: "orders",
            element: <ProfileOrders />,
          },
          {
            path: "returns",
            element: <ProfileReturns />,
          },
          {
            path: "my-profile",
            element: <Profile />,
          },
          {
            path: "support",
            element: <ProfileSupport />,
          },
          {
            path: "addresses",
            element: <ProfileAddresses />,
          },
          {
            path: "settings",
            element: <ProfileSettings />,
          },
          {
            path: "*",
            element: <div className="p-8 text-center">
              <h2 className="text-xl font-bold text-red-600">Profile Section Not Found</h2>
              <p className="mt-2">The requested profile page does not exist.</p>
            </div>
          }
        ]
      },
      {
        path: "changepass",
        element: <ChangePass />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "*",
        element: (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
              <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <a
                href="/"
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        )
      }
    ],
  },
]);

export default Router;