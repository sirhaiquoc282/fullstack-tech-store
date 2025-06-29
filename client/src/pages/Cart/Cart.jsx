import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchCartAPI,
  updateCartAPI,
  deleteCartAPI,
} from "../../store/features/CartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartSlice.cartItems);
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.authenSlice.isLogin);

  const [selectedItems, setSelectItems] = useState([]);

  useEffect(() => {
    dispatch(fetchCartAPI());
  }, [isLogin, dispatch]);

  useEffect(() => {
    setSelectItems((prev) =>
      prev.filter((item) => cartItems.some((c) => c.id === item.id))
    );
  }, [cartItems]);

  const handleDeleteCart = (item) => {
    if (!item?.productId?._id) return;

    dispatch(deleteCartAPI(item.productId._id));
    setSelectItems((prev) =>
      prev.filter((i) => i.productId?._id !== item.productId._id)
    );
    toast.info("Đã xoá sản phẩm khỏi giỏ hàng");
  };

  const handleSelectItem = (item) => {
    if (!item?.productId?._id) return;

    const productId = item.productId._id;
    setSelectItems((prev) => {
      const exists = prev.find((i) => i.productId?._id === productId);
      return exists
        ? prev.filter((i) => i.productId?._id !== productId)
        : [...prev, item];
    });
  };

  const increaseQuantity = (item) => {
    dispatch(
      updateCartAPI({
        productId: item.productId._id,
        quantity: item.quantity + 1,
      })
    );
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartAPI({
          productId: item.productId._id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const totalSelectedPrice = selectedItems.reduce((acc, item) => {
    const finalPrice =
      item.productId.price -
      (item.productId.price * item.productId.discountPercentage) / 100;
    return acc + finalPrice * item.quantity;
  }, 0);

  if (!cartItems) return null;

  return (
    <section className="xl:container mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🛒 Giỏ Hàng của bạn
      </h2>

      <div className="w-full overflow-x-auto rounded-xl shadow">
        <table className="w-full min-w-[700px] border border-gray-200 text-left bg-white">
          <thead className="bg-gray-100 text-gray-600 font-semibold text-sm">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems?.map((item, index) => {
              const finalPrice =
                item.productId?.price -
                (item.productId?.price * item.productId?.discountPercentage) /
                  100;
              return (
                <tr key={index} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-3 border-y border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productId?.thumbnail}
                        alt="product"
                        className="w-14 h-14 object-contain border rounded-lg"
                      />
                      <button
                        onClick={() =>
                          navigate(`/product/${item.productId._id}`)
                        }
                        className="hover:text-red-600 max-w-[160px] font-medium text-blue-700 line-clamp-2"
                      >
                        {item.productId?.description}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 border-y border-gray-200">
                    <span className="text-red-600 font-semibold">
                      {finalPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </td>
                  <td className="p-3 border-y border-gray-200">
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => decreaseQuantity(item)}
                        className="border px-2 py-1 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item)}
                        className="border px-2 py-1 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 border-y border-gray-200">
                    <span className="font-semibold text-red-600">
                      {(finalPrice * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </td>
                  <td className="p-3 border-y border-gray-200 text-center">
                    <div className="flex gap-3 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.some(
                          (i) => i.productId?._id === item.productId?._id
                        )}
                        onChange={() => handleSelectItem(item)}
                        className="w-5 h-5"
                      />

                      <button
                        onClick={() => handleDeleteCart(item)}
                        className="text-gray-500 hover:text-red-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total + Checkout */}
      <div className="flex flex-col md:flex-row justify-end items-center mt-6 gap-6">
        <span className="text-xl font-bold text-gray-800">
          Tổng cộng:{" "}
          <span className="text-red-600">
            {totalSelectedPrice.toLocaleString("vi-VN")} VNĐ
          </span>
        </span>
        <button
          onClick={() =>
            navigate("/checkout", { state: { selectedItems: selectedItems } })
          }
          disabled={selectedItems.length === 0}
          className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tiến hành thanh toán
        </button>
      </div>
    </section>
  );
};

export default Cart;
