import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { toast } from "react-toastify";
import { fetchCartAPI } from "../../store/features/CartSlice";
import apiService from "../../service/apiService";
import BanerLeft from "../../components/Banner/BannerLeft";
import { addToCart } from "../../store/features/CartSlice";

import {
  addWishList,
  deleteWishListItem,
  fetchWishList,
} from "../../store/features/WishListSlice";

const PageProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const isLogin = useSelector((state) => state.authenSlice.isLogin);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Lấy giá trị từ URL
  const limit = parseInt(searchParams.get("limit")) || 8;
  const page = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";
  const q = searchParams.get("q") || "";
  const category =
    searchParams.get("category") || location.state?.category || "";
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalProduct / limit);
  const wishItems = useSelector((state) => state.WishListSlice.wishItems);

  const fetchData = async () => {
    try {
      const params = {
        limit,
        skip,
        sortBy,
        order,
        q,
        page,
      };

      let res;
      if (q) {
        res = await apiService.getShearchProduct(params);
      } else if (category) {
        res = await apiService.getProductByCategories(category, params);
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
    fetchData();
  }, [searchParams.toString(), category]);

  const updateParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value == null) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value);
      }
    });
    setSearchParams(updatedParams);
  };

  const handlePageChange = (_, newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeSort = (e) => {
    const [newSortBy, newOrder] = e.target.value.split(",");
    updateParams({ sortBy: newSortBy, order: newOrder, page: 1 });
  };

  const handleAddToCart = (product) => {
    if (isLogin) {
      reduxDispatch(
        addToCart({
          productId: product.id,
          quantity: 1,
        })
      ).then(() => {
        reduxDispatch(fetchCartAPI()); // 👈 cập nhật giỏ hàng
      });
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } else {
      navigate("/login");
    }
  };


  const isInWishList = (productId) => {
    return wishItems.some(
      (item) => item._id === productId || item.id === productId
    );
  };

  const handleAddToWishList = (product) => {
    if (!isLogin) return navigate("/login");

    const isExist = isInWishList(product.id);
    if (isExist) {
      reduxDispatch(deleteWishListItem(product.id)).then(() => {
        reduxDispatch(fetchWishList()); // Cập nhật lại danh sách yêu thích sau khi xoá
      });
      toast.info("Đã xoá khỏi danh sách yêu thích");
    } else {
      reduxDispatch(addWishList({ ...product }));
      toast.success("Đã thêm sản phẩm vào yêu thích");
    }
  };

  return (
    <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
      <BanerLeft />

      <div className="lg:col-span-3 w-full">
        <select
          className="border border-gray-300 rounded-xl px-6 py-2 mb-6 mt-1 outline-none"
          onChange={handleChangeSort}
          value={sortBy && order ? `${sortBy},${order}` : "default"}
        >
          <option value="default">Mặc định</option>
          <option value="price,desc">Giảm dần theo giá</option>
          <option value="price,asc">Tăng dần theo giá</option>
          <option value="title,asc">Tên: A-Z</option>
          <option value="title,desc">Tên: Z-A</option>
        </select>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((item, index) => (
              <div className="w-full" key={index}>
                <div className="relative border border-gray-200 rounded-lg overflow-hidden group bg-white hover:shadow-lg">
                  <a className="block w-full aspect-square relative">
                    <img
                      src={item.thumbnail}
                      alt="product-default"
                      className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-100 group-hover:opacity-0"
                    />
                    <img
                      src={
                        Array.isArray(item.images)
                          ? item.images[0]
                          : item.images
                      }
                      alt="product-hover"
                      className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-0 group-hover:opacity-100"
                    />
                  </a>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-500">
                    <ul className="flex flex-col gap-3 bg-white p-2 rounded-md shadow">
                      <li>
                        <button onClick={() => handleAddToCart(item)}>
                          <i className="fas fa-shopping-bag text-gray-700 hover:text-red-600 hover:scale-110"></i>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleAddToWishList(item)}>
                          <i
                            className={`${
                              isInWishList(item.id)
                                ? "fas fa-heart text-red-600"
                                : "far fa-heart text-gray-700"
                            } hover:scale-110 transition-all duration-200`}
                          ></i>
                        </button>
                      </li>

                      <li>
                        <button onClick={() => navigate(`/product/${item.id}`)}>
                          <i className="far fa-eye text-gray-700 hover:text-red-600 hover:scale-110"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="hover:text-red-600 transition-all"
                  >
                    <h3 className="text-base font-semibold text-start line-clamp-1">
                      {item.title}
                    </h3>
                  </button>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mr-4 text-red-600 text-lg font-semibold">
                    {(
                      item.price -
                      (item.price * item.discountPercentage) / 100
                    ).toLocaleString("vi-VN", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    VNĐ
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg py-10">
              <p>Không tìm thấy sản phẩm nào phù hợp.</p>
              <button
                onClick={() => {
                  setSearchParams({});
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>

        {totalProduct > limit && (
          <div className="items-center flex justify-center mt-12">
            <Pagination
              count={totalPages}
              page={page}
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