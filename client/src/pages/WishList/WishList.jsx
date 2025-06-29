import React , {useEffect}from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../store/features/CartSlice"; // Ensure path is correct

import { useNavigate } from "react-router-dom";
import { FiXCircle, FiShoppingCart } from "react-icons/fi"; // Import icons for remove and add to cart

  import {
    deleteWishListItem,
    fetchWishList,
  } from "../../store/features/WishListSlice";
import { fetchCartAPI } from "../../store/features/CartSlice";
  const WishList = () => {
    const isLogin = useSelector((state) => state.authenSlice.isLogin);
    const wishItems = useSelector((state) => state.WishListSlice.wishItems);
    const loading = useSelector((state) => state.WishListSlice.loading);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A'; // Handle non-numeric amounts
    return new Intl.NumberFormat("en-US", { // Use en-US for USD
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 2,
    }).format(amount);
  };
    useEffect(() => {
      if (isLogin) {
        dispatch(fetchWishList());       
      }
    }, [isLogin, dispatch]);

const handleAddToCart = (product) => {
  if (isLogin) {
    dispatch(
      addToCart({
        productId: product._id,
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

   const handleDeleteWishList = (productId) => {
  dispatch(deleteWishListItem(productId))
    .unwrap()
    .then(() => {
      toast.info("Đã xoá khỏi danh sách yêu thích");
      // Không cần fetch lại
    })
    .catch(() => {
      toast.error("Lỗi khi xoá khỏi danh sách yêu thích");
    });
};


  // If wishlist is empty or null/undefined, display a message
  if (!wishItems || wishItems.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 lg:py-16 text-center bg-gray-50 rounded-xl shadow-lg mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any products to your wishlist yet.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="
            bg-red-700 text-white px-6 py-3 rounded-lg font-semibold
            hover:bg-red-800 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
          "
        >
          Start Shopping
        </button>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 lg:py-12 mt-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 lg:mb-12">
        My Wishlist
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 overflow-x-auto"> {/* Added padding and overflow */}
        <table className="w-full border-collapse"> {/* Use border-collapse for cleaner lines */}
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> {/* Empty for delete button */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Unit Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Stock Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"></th> {/* Empty for Add to Cart button */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200"> {/* Divide rows */}
            {wishItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                {/* Delete Button */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteWishList(item._id)}
                    className="
                      text-gray-500 hover:text-red-700 transition-colors duration-200
                      p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300
                    "
                    title="Remove from Wishlist"
                  >
                    <FiXCircle size={20} /> {/* Clearer delete icon */}
                  </button>
                </td>
                {/* Product Info */}
                <td className="px-4 py-3 whitespace-normal"> {/* allow text to wrap */}
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'placeholder.jpg'} // Use first image, add fallback
                      alt={item.title}
                      className="w-16 h-16 object-contain rounded-md border border-gray-100 p-1"
                    />
                    <div>
                      <p className="text-gray-800 font-medium line-clamp-2 hover:text-red-700 transition-colors duration-200">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.brand}</p> {/* Add brand if available */}
                    </div>
                  </div>
                </td>
                {/* Unit Price */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    {item.discountPercentage > 0 ? (
                      <>
                        <span className="text-red-700 text-lg font-bold">
                          {formatCurrency(item.price - (item.price * item.discountPercentage) / 100)}
                        </span>
                        <span className="line-through text-sm text-gray-500">
                          {formatCurrency(item.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 text-lg font-bold">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </div>
                </td>
                {/* Stock Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock ({item.stock})</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </td>
                {/* Add to Cart Button */}
                <td className="px-4 py-3 text-center">
                  {item.stock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="
                        bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm
                        hover:bg-red-800 transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
                        flex items-center justify-center gap-1 mx-auto /* Centering button */
                      "
                    >
                      <FiShoppingCart size={16} /> Add To Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="
                        bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm
                        cursor-not-allowed opacity-70 flex items-center justify-center gap-1 mx-auto
                      "
                    >
                      <FiShoppingCart size={16} /> Out of Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default WishList;