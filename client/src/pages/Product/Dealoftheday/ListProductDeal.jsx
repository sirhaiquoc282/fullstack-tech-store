import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import apiService from "../../../service/apiService";
import BoxProductDeal from "./BoxProductDeal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="z-10 absolute right-2 top-1/2 transform -translate-y-1/2 
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
      className="z-10 absolute left-2 top-1/2 transform -translate-y-1/2 
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

const ListProductDeal = () => {
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

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDataProduct = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProduct();
      if (res.status === 200) {
        setProduct(res.data.products);
        console.log(res, "ress");
        
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

  return (
    <section className="relative mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4">
      <h2 className="font-bold text-2xl mb-1">DEAL OF THE DAY</h2>
      <hr className="mb-6" />
      <div className="mx-auto">
        <Slider {...settings}>
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="px-2">
                  <Box
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Skeleton variant="rectangular" height={120} />
                    <Skeleton
                      variant="text"
                      height={28}
                      width="80%"
                      sx={{ mt: 2 }}
                    />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                  </Box>
                </div>
              ))
            : product.slice(0, 12).map((item, idx) => (
                <div key={idx} className="px-2">
                  <BoxProductDeal item={item} />
                </div>
              ))}
        </Slider>
      </div>
    </section>
  );
};

export default ListProductDeal;
