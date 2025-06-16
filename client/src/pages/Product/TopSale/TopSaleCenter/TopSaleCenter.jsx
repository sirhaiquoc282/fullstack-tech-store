import React, { useEffect, useState } from "react";
import product1 from "../../../../assets/img/product-1.jpg";
import apiService from "../../../../service/apiService";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../store/features/CartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TopSaleCenter = () => {
  const [productDetail, setproductDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleAddToCart = () => {
    console.log(productDetail);
    dispatch(
      addToCart({
        ...productDetail,
        quantity: 1,
      })
    );
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };
  const fetchApiDetail = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProduct();
      console.log(res, "dâttatat");

      if (res.status === 200) {
        setproductDetail(res.data.products[22]);
        console.log(res.data.products[22]);
        
        setMainImg(res.data.res.data.products[22].thumbnail);
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
                className="w-full h-[550px] object-contain "
                src={mainImg}
                alt=""
              />
            </div>

            {/* Thumbnail images */}
            <div className="absolute top-3 right-5 flex flex-col gap-3">
              {productDetail?.images.slice(1, 5).map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded-lg w-10 md:w-12 lg:w-14 xl:w-16 p-1"
                >
                  <img
                    className="w-full h-[50px] object-contain cursor-pointer"
                    src={item}
                    alt=""
                    onClick={() => setMainImg(item)}
                  />
                </div>
              ))}
            </div>

            {/* Sale badge */}
            <div className="absolute bottom-8 left-12 xl:left-20 -translate-x-1/2">
              <span className="bg-red-600 text-white font-extrabold px-1 text-xs md:text-sm lg:text-base xl:text-lg py-1 xl:px-6 xl:py-2 rounded-lg text-center block">
                <p>SAVE</p>
                <p>{productDetail.discountPercentage}%</p>
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-1 px-4">
            <a onClick={() => navigate(`/product/${productDetail.id}`)} className="font-bold text-blue-700 text-xl hover:text-red-600 cursor-pointer transition-all duration-150 hover:duration-700 line-clamp-1">
              {productDetail.description}
            </a>
            <span className="mr-4 text-red-600 text-2xl font-semibold">
              {(
                productDetail.price -
                (productDetail.price * productDetail.discountPercentage) / 100
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>

            <span className="line-through text-lg font-semibold text-gray-400">
               <span className="mr-4 text-gray-400 text-xl font-semibold line-through">
              {(
                productDetail.price 
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>
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

                <button onClick={() => navigate(`/product/${productDetail.id}`)}>
                <i className="far fa-eye fa-lg text-gray-700 hover:text-red-600 hover:scale-110 cursor-pointer"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSaleCenter;
