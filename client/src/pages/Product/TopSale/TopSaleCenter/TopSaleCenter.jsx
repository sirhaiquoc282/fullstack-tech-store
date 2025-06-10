import React, { useEffect, useState } from "react";
import product1 from "../../../../assets/img/product-1.jpg";
import apiService from "../../../../service/apiService";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../store/features/CartSlice";
import { toast } from "react-toastify";

const TopSaleCenter = () => {
  const [productDetail, setproductDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    console.log(productDetail);
    dispatch(
      addToCart({
        ...productDetail,
        quantity: 1,
      })
    );
    toast.success('Đã thêm sản phẩm vào giỏ hàng')
  };
  const fetchApiDetail = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProductDetail();
      if (res.status === 200) {
        setproductDetail(res.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiDetail();
  }, []);

  return (
    <div className="w-full xl:col-span-2 order-1 xl:order-2 mx-0 xl:mx-5">
      {loading ? (
        <Box sx={{ pt: 0.5 }}>
          <Skeleton variant="rectangular" height={300} />
          <Skeleton width="60%" />
        </Box>
      ) : (
        <div className="border border-gray-400 rounded-lg">
          <div className="px-4 pt-4 relative flex justify-center">
            <div className="w-[475px]">
              <img
                className="w-full h-full object-contain"
                src={productDetail.images?.[0] || product1}
                alt=""
              />
            </div>

            {/* Thumbnail images */}
            <div className="absolute top-3 right-5 flex flex-col gap-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded-lg w-10 md:w-12 lg:w-14 xl:w-16 p-1"
                >
                  <img
                    className="w-full h-full object-contain"
                    src={product1}
                    alt=""
                  />
                </div>
              ))}
            </div>

            {/* Sale badge */}
            <div className="absolute bottom-8 left-12 xl:left-20 -translate-x-1/2">
              <span className="bg-red-600 text-white font-extrabold px-1 text-xs md:text-sm lg:text-base xl:text-lg py-1 xl:px-6 xl:py-2 rounded-lg text-center block">
                <p>SAVE</p>
                <p>{productDetail.rating}</p>
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-1 px-4">
            <a className="font-bold text-blue-700 text-xl hover:text-red-600 cursor-pointer transition-all duration-150 hover:duration-700 line-clamp-1">
              {productDetail.description}
            </a>
            <span className="text-2xl font-bold mr-5">
              {productDetail.price - productDetail.rating}
            </span>
            <span className="line-through text-lg font-semibold text-gray-400">
              {productDetail.price}
            </span>
          </div>

          {/* Actions */}
          <div className="mx-3">
            <ul className="flex gap-5 p-2 rounded-md shadow-inherit">
              <li>
                <button onClick={handleAddToCart}>
                  {" "}
                  <i className="fas fa-shopping-bag fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                </button>
              </li>
              <li>
                <i className="far fa-heart fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
              </li>
              <li>
                <i className="far fa-eye fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSaleCenter;
