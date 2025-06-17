import React, { useEffect, useState, useRef } from "react";
import apiService from "../../service/apiService";
import { useNavigate } from "react-router-dom";

const BannerRight = () => {
  const navigate = useNavigate();
const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await apiService.getProduct();
        if (res.status === 200 && res.data.products.length > 0) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Lỗi khi lấy ảnh banner từ API:", error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 3000);
    }

    return () => clearInterval(intervalRef.current);
  }, [products]);

  const currentBanner = products[currentIndex]?.thumbnail || "";


  return (
    <div className="relative lg:col-span-3 w-full h-full">
      {currentBanner && (
        <>
          <img
            src={currentBanner}
            alt="Summer Sale Banner"
            className="w-full h-[300px] md:h-[600px] object-contain rounded-lg shadow"
          />
          <div className="absolute bottom-1/2  bg-opacity-10 rounded-lg flex-col items-center justify-center ">
            <h2 className="text-red-500 text-xl md:text-3xl font-bold text-center px-4">
              Hè sôi động 🌞 <br />
              Mua sắm cùng <span className="text-red-500">QAD</span>

            </h2>
            <button
            onClick={()=>{navigate("/shop")}}
            className="ml-4 border border-gray-300 px-5 py-4 rounded-full text-red-500 font-bold text-xl hover:bg-red-600 hover:text-white duration-100 hover:duration-200 transition-all ">Mua Ngay</button>

          </div>
          <div className="absolute  top-1/2 right-0  bg-opacity-10 rounded-lg flex-col items-center justify-center ">
            <h2 className="text-red-500 text-xl md:text-3xl font-bold text-center px-4">
              Hàng vạn deal <br /> 
               hời đang chờ bạn !

            </h2>
            

          </div>
        </>
      )}
    </div>
  );
};

export default BannerRight;
