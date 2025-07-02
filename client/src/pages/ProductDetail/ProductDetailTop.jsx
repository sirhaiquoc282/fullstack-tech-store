import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../service/apiService";
import { Backdrop, CircularProgress } from "@mui/material";
import ProductDetailRec from "./ProductDetailRec";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/features/CartSlice";
import { addWishList } from "../../store/features/WishListSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartAPI } from "../../store/features/CartSlice";
import axios from "axios";
const ProductDetailTop = () => {
  const { id } = useParams();
  const [dataDetail, setDataDetail] = useState(null);
  const [category, setCategory] = useState("");
  const [productByCategory, setProductByCategory] = useState([]);
  const divref = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const isLogin = useSelector((state) => state.authenSlice.isLogin);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const name = localStorage.getItem("username");
  
  useEffect(() => {
    if (id) {
      if (divref) {
        divref.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
      const fetchDataDetailProduct = async () => {
        try {
          const res = await apiService.getProductDetail(id);

          if (res.status === 200) {
            setDataDetail(res.data);

            setCategory(res.data.category);
            setMainImg(res.data.thumbnail);
          } else {
            console.error("Unexpected response:", res);
          }
        } catch (error) {
          console.error("Failed to fetch product detail:", error);
        }
      };
      fetchDataDetailProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchProductByCategory = async () => {
      const res = await apiService.getProductByCategories(category);
      if (res.status === 200) {
        console.log(res.data.products, "sssss");
        setProductByCategory(res.data.products);
      }
    };
    if (category) {
      fetchProductByCategory();
    }
  }, [category]);
  const dispatch = useDispatch();
  const handleAddToCart = (product) => {
    if (isLogin) {
      dispatch(
        addToCart({
          productId: product.id,
          quantity: 1,
        })
      ).then(() => {
        dispatch(fetchCartAPI()); // 👈 cập nhật giỏ hàng
      });
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
  const getAverageRating = () => {
    const reviews = dataDetail?.reviews || [];
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };
  const handleSubmitReview = async (e) => {
    console.log(review, "reviet");

    e.preventDefault();
    if (!isLogin) {
      return navigate("/login");
    }

    if (review.rating < 1) {
      toast.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        {
          rating: review.rating,
          comment: review.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Đánh giá đã được gửi!");

        // Cập nhật lại dữ liệu chi tiết sản phẩm
        const updated = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setDataDetail(updated.data);

        // Reset form
        setReview({ rating: 0, comment: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Lỗi khi gửi đánh giá, thử lại sau."
      );
    }
  };
  console.log(dataDetail, "data");
  
  return dataDetail ? (
    <section className="containermb xl:container mt-12">
      <div ref={divref} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="xl:relative col-span-1">
          <div className="xl:w-[600px] xl:h-full">
            <img
              className="w-full h-full object-contain p-6"
              src={mainImg}
              alt="headphone"
            />
          </div>
          <div className="flex gap-4 xl:absolute xl:flex-col xl:gap-2 xl:top-2 xl:right-1">
            {[dataDetail.thumbnail, ...(dataDetail.images || [])]
              .slice(0, 5)
              .map((image, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImg(image)}
                  className={`w-14 border rounded-lg p-1 mb-2 cursor-pointer ${
                    image === mainImg ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <img
                    className="w-full h-full object-contain"
                    src={image}
                    alt="thumb"
                  />
                </div>
              ))}
          </div>
        </div>
        <div>
          <div>
            <p className="text-sm text-gray-500 s tracking-wider">
              Categories: {dataDetail.tags[1]?.toUpperCase()}
            </p>
            <h4 className="text-2xl font-bold tracking-wider mt-3">
              {dataDetail.title}
            </h4>
            <div className="flex mt-3 gap-4 items-center">
              <div className="flex items-center gap-2 text-yellow-500 text-2xl">
                {[...Array(5)].map((_, index) => {
                  const avgRating = getAverageRating();
                  const isFull = index < Math.floor(avgRating);
                  const isHalf =
                    index < avgRating && index >= Math.floor(avgRating);
                  return (
                    <i
                      key={index}
                      className={
                        isFull
                          ? "fas fa-star"
                          : isHalf
                          ? "fas fa-star-half-alt"
                          : "far fa-star"
                      }
                    />
                  );
                })}
                <span className="text-base text-gray-600 ml-2">
                  ({getAverageRating().toFixed(1)} / 5)
                </span>
              </div>

              <div className="w-px h-5 bg-gray-300 mx-2" />
              <div className="flex gap-2">
                <p>Reviews({dataDetail.reviews?.length || 0})</p>

                <p>sold</p>
              </div>
            </div>
          </div>
          <hr className="w-full border-gray-300 mt-2" />
          <div className="mt-3">
            <span className="mr-4 text-red-600 text-2xl font-semibold">
              {(
                dataDetail.price -
                (dataDetail.price * dataDetail.discountPercentage) / 100
              ).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>

            <span className="mr-4 text-gray-500 text-xl line-through font-semibold">
              {dataDetail.price.toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}{" "}
              VNĐ
            </span>
            <div className="flex items-center text-gray-600">
              <i className="fas fa-shipping-fast mr-5" />
              Free shipping
            </div>
          </div>
          <hr className="w-full border-gray-300 mt-2" />
          <div className="flex flex-col gap-1 mt-3">
            <div>
              <span className="mr-6 font-bold text-base">Brand</span>
              <span className="text-base text-gray-700">
                {dataDetail.brand}
              </span>
            </div>
            <div>
              <span className="mr-6 font-bold text-base">Trả hàng</span>
              <span className="text-base text-gray-700">
                {dataDetail.returnPolicy}
              </span>
            </div>
            <div>
              <span className="mr-6 font-bold text-base">Mã sản phẩm</span>
              <span className="text-base text-gray-700">{dataDetail.sku}</span>
            </div>
            <div>
              <span className="mr-6 font-bold text-base">Bảo hành</span>
              <span className="text-base text-gray-700">
                {dataDetail.warrantyInformation}
              </span>
            </div>
          </div>
          <hr className="w-full border-gray-300 mt-2" />
          {/* Quantity + Action Buttons */}
          <div className="mt-6 space-y-6">
            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
              <span className="text-gray-800 font-semibold text-base">
                Số lượng
              </span>
              <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-all"
                >
                  −
                </button>
                <span className="px-6 py-2 text-red-600 font-extrabold text-lg select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => handleAddToCart(dataDetail)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-blue-900 hover:to-blue-950 transition-all duration-300 rounded-full py-3 px-6 text-white font-bold shadow-md hover:scale-105"
              >
                <i className="fas fa-cart-plus mr-2" />
                Thêm vào giỏ hàng
              </button>

              <button
                onClick={() => handleAddToWishList(dataDetail)}
                className="bg-white text-red-600 border-2 border-red-500 hover:bg-red-100 transition-all duration-300 rounded-full py-3 px-6 font-bold shadow-sm hover:scale-105"
              >
                <i className="far fa-heart mr-2" />
                Yêu thích
              </button>
            </div>
          </div>

          <hr className="w-full border-gray-300 mt-2" />
          <div>
            <span className="font-bold text-gray-600 text-lg">
              About this item
            </span>
            <div className="text-gray-600 -tracking-tight">
              <p>{dataDetail.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      {/* <div className="mt-12 border-[1px] border-gray-400 rounded-lg">
        <h5 className="bg-gray-100 px-4 py-3 font-semibold text-2xl rounded-t-md text-gray-600">
          Descipttion
        </h5>
        <div className="px-5 pb-5 font-light text-gray-8 tracking-wide mt-3">
          <span>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit...
          </span>
          <div className="m-auto mt-3 xl:w-[600px]">
            <img
              className="object-contain w-full h-full"
              src="../public/img/product-1.jpg"
              alt=""
            />
          </div>
          <span>Lorem ipsum dolor sit amet consectetur...</span>
          <div className="m-auto mt-3 xl:w-[600px]">
            <img
              className="object-contain w-full h-full"
              src="../public/img/product-1.jpg"
              alt=""
            />
          </div>
          <span>Lorem ipsum dolor sit amet consectetur...</span>
        </div>
      </div> */}

      {/* INFORMATION */}
      {/* <div className="mt-4 border-[1px] border-gray-400 rounded-lg">
        <h5 className="bg-gray-100 px-4 py-3 font-semibold text-2xl rounded-t-md text-gray-600">
          Product infomation
        </h5>
        <div className="px-5 font-light text-gray-8 my-3 flex flex-col gap-2">
          <div>
            <span className="mr-6 font-bold text-base">Package Dimensions</span>
            <span className="text-base text-gray-700">8 x 8 x 6.7 inches</span>
          </div>
          <hr className="w-full border-gray-200 mt-2" />
          <div>
            <span className="mr-6 font-bold text-base">Item Weight</span>
            <span className="text-base text-gray-700">2.2 pounds</span>
          </div>
          <hr className="w-full border-gray-200 mt-2" />
          <div>
            <span className="mr-6 font-bold text-base">Manufacturer</span>
            <span className="text-base text-gray-700">Elite Gourmet</span>
          </div>
          <hr className="w-full border-gray-200 mt-2" />
          <div>
            <span className="mr-6 font-bold text-base">ASIN</span>
            <span className="text-base text-gray-700">B09H3LWKYQ</span>
          </div>
          <hr className="w-full border-gray-200 mt-2" />
          <div>
            <span className="mr-6 font-bold text-base">Country of Origin</span>
            <span className="text-base text-gray-700">China</span>
          </div>
        </div>
      </div> */}

      {/* REVIEWS */}
      <div className="mt-4 border-[1px] border-gray-400 rounded-lg">
        <h5 className="bg-gray-100 px-4 py-3 font-semibold text-2xl rounded-t-md text-gray-600">
          REVIEWS
        </h5>
        <div className="px-5 font-light text-gray-8 my-5 grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div>
            <div>
              <span className="text-rose-600 font-bold text-5xl ">
                {getAverageRating().toFixed(1)}
              </span>
              <span className="font-bold text-gray-400 text-3xl">/5</span>

              <div className="flex items-center gap-2 text-yellow-500 text-2xl">
                {[...Array(5)].map((_, index) => {
                  const avgRating = getAverageRating();
                  const isFull = index < Math.floor(avgRating);
                  const isHalf =
                    index < avgRating && index >= Math.floor(avgRating);
                  return (
                    <i
                      key={index}
                      className={
                        isFull
                          ? "fas fa-star"
                          : isHalf
                          ? "fas fa-star-half-alt"
                          : "far fa-star"
                      }
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-800 font-semibold text-xl">
                Add your comment
              </p>
              <div className="mt-2">
                <div className="flex gap-2 cursor-pointer text-yellow-500 text-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fa-star ${
                        review.rating >= star ? "fas" : "far"
                      }`}
                      onClick={() => setReview({ ...review, rating: star })}
                    />
                  ))}
                </div>

                <form
                  className="flex flex-col font-normal text-base gap-4 mt-3"
                  onSubmit={handleSubmitReview}
                >
                  <textarea
                    rows="4"
                    placeholder="Viết đánh giá của bạn..."
                    className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-red-600 resize-none"
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-950 text-white font-bold hover:bg-red-600 transition-all duration-150 hover:scale-105 py-3"
                  >
                    Gửi đánh giá
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            {dataDetail.reviews.map((item, idx) => (
              <div className="mt-5" key={idx}>
                <div className="flex gap-2 items-center">
                  {/* <div className="w-20 h-20 border-none rounded-full">
                    <img
                      className="w-full h-full object-contain p-1"
                      src="../public/img/product-1.jpg"
                      alt="avatar review"
                    />
                    
                  </div> */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl">
                    {item.reviewerEmail?.slice(" ").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <span>{item.reviewerName}</span>
                    <div className="flex gap-1 mt-2 text-yellow-500">
                      {[...Array(5)].map((_, starIndex) => (
                        <i
                          key={starIndex}
                          className={`fa-star ${
                            starIndex < item.rating ? "fas" : "far"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-900 font-semibold tracking-wide mt-3 ml-12">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductDetailRec data={productByCategory} />
    </section>
  ) : (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default ProductDetailTop;