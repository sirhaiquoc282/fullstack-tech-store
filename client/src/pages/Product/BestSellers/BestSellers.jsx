import React, { useState, useEffect, useRef } from "react";
import banner from "../../../assets/img/banner-14.jpg";
import apiService from "../../../service/apiService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../store/features/CartSlice";
import { addWishList } from "../../../store/features/WishListSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="z-10 absolute right-0 top-1/2 transform -translate-y-1/2 
        w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg 
        flex items-center justify-center hover:bg-gray-50 transition-all duration-300 cursor-pointer
        group opacity-0 group-hover:opacity-100"
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="z-10 absolute left-0 top-1/2 transform -translate-y-1/2 
        w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg 
        flex items-center justify-center hover:bg-gray-50 transition-all duration-300 cursor-pointer
        group opacity-0 group-hover:opacity-100"
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
}

const BestSellers = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplay: true, // Thêm hiệu ứng tự động chuyển
    autoplaySpeed: 5000, // Tốc độ chuyển slide (5 giây)
    speed: 800, // Tốc độ hiệu ứng chuyển
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: false
        }
      },
    ],
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.authenSlice.isLogin);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null); // Ref để kiểm soát slider

  const handleAddToCart = (product) => {
    if (isLogin) {
      dispatch(
        addToCart({
          productId: product.id,
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
      dispatch(addWishList(product));
      toast.success("Đã thêm sản phẩm vào yêu thích");
    } else {
      navigate("/login");
    }
  };

  const fetchDataProduct = async () => {
    try {
      setLoading(true);
      const res = await apiService.getProduct();
      if (res.status === 200) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataProduct();
  }, []);

  // Hiển thị skeleton loading khi đang tải dữ liệu
  if (loading) {
    return (
      <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4">
        <h2 className="font-extrabold text-2xl mb-1">BEST SELLERS</h2>
        <hr className="mb-6 border-gray-200" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Skeleton cho card lớn */}
          <div className="col-span-1 sm:col-span-2 rounded-xl bg-gray-100 h-[366px] animate-pulse"></div>

          {/* Skeleton cho slider */}
          <div className="col-span-1 sm:col-span-3">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="px-2">
                  <div className="bg-gray-100 rounded-lg h-[300px] animate-pulse"></div>
                  <div className="mt-3 px-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3 mb-1"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Kiểm tra nếu không có sản phẩm
  if (products.length === 0) {
    return (
      <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4">
        <h2 className="font-extrabold text-2xl mb-1">BEST SELLERS</h2>
        <hr className="mb-6 border-gray-200" />
        <div className="text-center py-12">
          <p className="text-gray-500">Không có sản phẩm nào</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4">
      <h2 className="font-extrabold text-2xl mb-1">BEST SELLERS</h2>
      <hr className="mb-6 border-gray-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Card lớn: Camera */}
        {products[7] && (
          <div
            onClick={() => navigate(`/product/${products[7].id}`)}
            className="col-span-1 sm:col-span-2 relative overflow-hidden rounded-xl group cursor-pointer
              border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-[366px] bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-500"></div>

              <div className="w-full h-full flex items-center justify-center">
                <div className="w-56 h-56 bg-white/30 backdrop-blur-sm rounded-full absolute"></div>
                <img
                  className="w-full h-full object-cover mix-blend-multiply"
                  src={banner}
                  alt=""
                />
              </div>

              <div className="w-40 sm:w-56 absolute top-16 sm:top-24 -right-5 transform group-hover:scale-105 transition-transform duration-500">
                <img
                  className="w-full h-full object-contain drop-shadow-lg"
                  src={products[7]?.images[2]}
                  alt=""
                />
              </div>

              <div className="text-black absolute top-28 sm:top-40 left-6 sm:left-14 max-w-[70%]">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-wider group-hover:translate-x-2 transition-transform">
                  {products[7]?.title}
                </h3>
                <p className="mt-8 sm:mt-16 text-xs sm:text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                  {products[7]?.description.substring(0, 100)}...
                </p>
              </div>

              <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                BÁN CHẠY NHẤT
              </div>
            </div>
          </div>
        )}

        {/* Slider cho các sản phẩm khác */}
        <div className="col-span-1 sm:col-span-3 relative group">
          <Slider {...settings} ref={sliderRef}>
            {products.slice(1, 7).map((item, idx) => (
              <div className="px-2" key={idx}>
                <div className="relative border border-gray-100 rounded-xl overflow-hidden group bg-white 
                  shadow-sm hover:shadow-md transition-all duration-300">

                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-full h-[265px] flex items-center justify-center cursor-pointer relative bg-gray-50"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-contain p-5 transition-all duration-500 opacity-100 group-hover:opacity-0 absolute top-0 left-0"
                    />
                    <img
                      src={item.thumbnail}
                      alt={`${item.title}-hover`}
                      className="w-full h-full object-contain p-5 transition-all duration-500 opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                    />

                    {/* Badge giảm giá */}
                    {item.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{Math.round(item.discountPercentage)}%
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ul className="flex flex-col gap-3 bg-white p-2 rounded-lg shadow-lg">
                      <li
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <i className="fas fa-shopping-bag text-gray-700 hover:text-blue-600 cursor-pointer"></i>
                      </li>
                      <li
                        onClick={(e) => { e.stopPropagation(); handleAddToWishList(item); }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <i className="far fa-heart text-gray-700 hover:text-red-600 cursor-pointer"></i>
                      </li>
                      <li
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <i className="far fa-eye text-gray-700 hover:text-green-600 cursor-pointer"></i>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 px-4 pb-4">
                    <h3
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="text-sm font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1 h-10">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-red-600 font-bold">
                          {(
                            item.price -
                            (item.price * item.discountPercentage) / 100
                          ).toLocaleString("vi-VN", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          VNĐ
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            {item.price.toLocaleString("vi-VN")} VNĐ
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                        className="bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white 
                          w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;