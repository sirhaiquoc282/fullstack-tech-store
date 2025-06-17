import React, { useState, useEffect } from "react";
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
      className="z-10 absolute right-2 top-1/3 transform -translate-y-1/2 
        w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md 
        flex items-center justify-center hover:bg-gray-100 transition-all duration-200 cursor-pointer"
    >
      <svg
        className="w-5 h-5 text-gray-700"
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
      className="z-10 absolute left-2 top-1/3 transform -translate-y-1/2 
        w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md 
        flex items-center justify-center hover:bg-gray-100 transition-all duration-200 cursor-pointer"
    >
      <svg
        className="w-5 h-5 text-gray-700"
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
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector((state) => state.authenSlice.isLogin);

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
  const [product, setProduct] = useState([]);

  const fetchDataProduct = async () => {
    try {
      const res = await apiService.getProduct();
      if (res.status === 200) {
        setProduct(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
    }
  };
  console.log(product);

  useEffect(() => {
    fetchDataProduct();
  }, []);
  return (
    <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4">
      <h2 className="font-extrabold text-2xl mb-1">BEST SELLERS</h2>
      <hr className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ">
        {/* Card lớn: Camera */}
        <div
        onClick={() => navigate(`/product/${product[7].id}`)}
        className="col-span-1 sm:col-span-2 relative hover:scale-105 duration-200 hover:duration-700 transition-all cursor-pointer">
          <div>
            <img
              className="w-full h-[300px] sm:h-[366px] object-contain rounded-xl"
              src={banner}
              alt=""
            />
          </div>
          <div className="w-40 sm:w-56 absolute top-20 sm:top-24 -right-5">
            <img className="w-full h-full object-cover" src={product[7]?.images[2]} alt="" />
          </div>
          <div className="text-black absolute top-28 sm:top-40 left-6 sm:left-14 max-w-[70%]">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-widest">
              {product[7]?.title}
            </h3>
            <p className="mt-8 sm:mt-20 text-xs sm:text-sm">
               {product[7]?.description}
            </p>
          </div>
        </div>

        <Slider {...settings} className="col-span-1 sm:col-span-3">
          {product.slice(1, 4).map((item, idx) => (
            <div className="px-2 " key={idx}>
              <div className="relative border border-gray-200 rounded-md overflow-hidden group bg-white  shadow-inner hover:shadow-lg">
                <a className="w-full h-[265px] flex items-center justify-center cursor-pointer relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-100 group-hover:opacity-0 absolute top-0 left-0"
                  />
                  <img
                    src={item.thumbnail}
                    alt={`${item.title}-hover`}
                    className="w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                  />
                </a>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <ul className="flex flex-col gap-3 bg-white p-2 rounded-md shadow">
                    <li onClick={() => handleAddToCart(item)}>
                      <i className="fas fa-shopping-bag text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                    </li>
                    <li onClick={() => handleAddToWishList(item)}>
                      <i className="far fa-heart text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                    </li>
                    <li onClick={() => navigate(`/product/${item.id}`)}>
                      <i className="far fa-eye text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 px-2">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-3">
                  {item.description}
                </p>
                <span className="mr-4 text-red-600 font-bold">
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
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BestSellers;
