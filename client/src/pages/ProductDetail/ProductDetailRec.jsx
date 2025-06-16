import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/features/CartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="z-10 absolute right-2 top-40 transform -translate-y-1/2 
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
      className="z-10 absolute left-2 top-40 transform -translate-y-1/2 
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

const ProductDetailRec = ({ data }) => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  const dispatch = useDispatch();
  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    );
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };
  return (
    <div className="mt-8 lg:mt-10 xl:mt-12 mx-auto">
      <h2 className="font-bold text-2xl mb-1">Sản Phẩm Liên Quan</h2>
      <hr className="mb-6" />
      <div className="mx-auto">
        <Slider {...settings}>
          {data.map((item, idx) => (
            <div className="w-full px-2" key={idx}>
              <div className="relative border border-gray-200 rounded-lg overflow-hidden group bg-white">
                {/* Product Image Container */}
                <a
                  className="block w-full aspect-square relative bg-white"
                  href="#"
                >
                  <img
                    src={item.thumbnail}
                    alt="product-default"
                    className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-100 group-hover:opacity-0"
                  />
                  <img
                    src={item.images[2]}
                    alt="product-hover"
                    className="absolute inset-0 w-full h-full object-contain p-5 transition-opacity duration-1000 opacity-0 group-hover:opacity-100"
                  />
                </a>

                {/* Hover Icons */}
                <div className="absolute top-3 right-3 opacity-0 translate-x-1 group-hover:opacity-100 transition duration-500">
                  <ul className="flex flex-col gap-3 bg-white p-2 rounded-md shadow">
                    <li>
                      <button onClick={() => handleAddToCart(item)}>
                        <i className="fas fa-shopping-bag text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                      </button>
                    </li>
                    <li>
                      <i className="far fa-heart text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                    </li>
                    <li>
                      <i className="far fa-eye text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-3">
                <a
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="text-sm font-semibold truncate hover:text-red-600 cursor-pointer line-clamp-1"
                >
                  {item.title}
                </a>
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
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductDetailRec;
