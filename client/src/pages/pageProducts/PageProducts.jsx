import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { toast } from "react-toastify";

import apiService from "../../service/apiService";
import BanerLeft from "../../components/Baner/BanerLeft";
import { addToCart } from "../../store/features/CartSlice";
import { addWishList } from "../../store/features/WishListSlice";
import { useSearchParams } from "react-router-dom";

import {
  filterproductReducer,
  initialState,
  TYPE_ACITON,
} from "./Reducer/FilterProduct";

const PageProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("search");

  

  const [products, setProducts] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);

  const location = useLocation();
  const selectedCategory = location.state?.category;
  const navigate = useNavigate();

  const isLogin = useSelector((state) => state.authenSlice.isLogin);
  const reduxDispatch = useDispatch();



  const [filterProduct, dispatch] = useReducer(
    filterproductReducer,
    initialState
  );
  useEffect(() => {
    dispatch({
      type: TYPE_ACITON.CHANGE_SEARCH,
      payload: keyword || "",
    });
  }, [keyword]);
  const productsPerPage = filterProduct.limit;
  const totalPages = Math.ceil(totalProduct / productsPerPage);

  const handleChangeSort = (e) => {
    const [sortBy, order] = e.target.value.split(",");
    dispatch({
      type: TYPE_ACITON.CHANGE_SORT,
      payload: { sortBy, order },
    });
  };

  const handlePageChange = (_, page) => {
    dispatch({
      type: TYPE_ACITON.CHANGE_PAGE,
      payload: {
        page,
        skip: (page - 1) * productsPerPage,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchDataProduct = async () => {
    try {
      const params = {
        sortBy: filterProduct.sortBy,
        order: filterProduct.order,
        limit: filterProduct.limit,
        skip: filterProduct.skip,
        q: filterProduct.q,
      };

      let res;
      if (filterProduct.q) {
        res = await apiService.getShearchProduct(params);
      } else if (selectedCategory) {
        res = await apiService.getProductByCategories(selectedCategory, params);
      } else {
        res = await apiService.getProduct(params);
      }
      if (res.status === 200) {
        setProducts(res.data.products);
        setTotalProduct(res.data.total);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchDataProduct();
  }, [selectedCategory, JSON.stringify(filterProduct)]);

  const handleAddToCart = (product) => {
    if (isLogin) {
      reduxDispatch(
        addToCart({
          ...product,
          quantity: 1,
        })
      );
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } else {
      navigate("/login");
    }
  };

  const handleAddToWishList = (product) => {
    if (isLogin) {
      reduxDispatch(addWishList({ ...product }));
      toast.success("Đã thêm sản phẩm vào yêu thích");
    } else {
      navigate("/login");
    }
  };



  return (
    <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
      <BanerLeft />

      <div className="lg:col-span-3 w-full">
        <select
          className="border border-gray-300 rounded-xl px-6 py-2 mb-6 mt-1 outline-none"
          onChange={handleChangeSort}
        >
          <option value="default" className="cursor-pointer">
            Mặc định
          </option>
          <option value="price,desc" className="cursor-pointer">
            Giảm dần theo giá
          </option>
          <option value="price,asc" className="cursor-pointer">
            Tăng dần theo giá
          </option>
          <option value="title,asc" className="cursor-pointer">
            Tên: A-Z
          </option>
          <option value="title,desc" className="cursor-pointer">
            Tên: Z-A
          </option>
        </select>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item, index) => (
            <div className="w-full" key={index}>
              <div className="relative border border-gray-200 rounded-lg overflow-hidden group bg-white  shadow-current hover:shadow-lg">
                <a className="block w-full aspect-square relative bg-white">
                  <img
                    src={item.thumbnail}
                    alt="product-default"
                    className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-100 group-hover:opacity-0"
                  />
                  <img
                    src={
                      Array.isArray(item.images) ? item.images[0] : item.images
                    }
                    alt="product-hover"
                    className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-0 group-hover:opacity-100"
                  />
                </a>
                <div className="absolute top-3 right-3 opacity-0 translate-x-1 group-hover:opacity-100 transition duration-500">
                  <ul className="flex flex-col gap-3 bg-white p-2 rounded-md shadow">
                    <li>
                      <button onClick={() => handleAddToCart(item)}>
                        <i className="fas fa-shopping-bag text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleAddToWishList(item)}>
                        <i className="far fa-heart text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigate(`/product/${item.id}`)}>
                        <i className="far fa-eye text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="cursor-pointer hover:text-red-600 transition-all"
                >
                  <h3 className="text-base font-semibold truncate">
                    {item.tags?.[1] || "No Tag"}
                  </h3>
                </button>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {item.description}
                </p>
                <span className="text-red-600 font-bold">${item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {totalProduct > productsPerPage && (
          <div className="items-center flex justify-center mt-12">
            <Pagination
              count={totalPages}
              page={filterProduct.page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default PageProducts;
