import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [selectItems, setSelectItems] = useState([]);

  useEffect(() => {
    dispatch(fetchCartAPI());
  }, [dispatch]);

  useEffect(() => {
    setSelectItems((prev) =>
      prev.filter((item) => cartItems.some((c) => c.id === item.id))
    );
  }, [cartItems]);

  const handleDeleteCart = (product) => {
    dispatch(deleteCartAPI(product.id));
    setSelectItems((prev) => prev.filter((i) => i.id !== product.id));
  };

  const handleSelectItem = (item) => {
    setSelectItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  const increaseQuantity = (item) => {
    dispatch(updateCartAPI({ ...item, quantity: item.quantity + 1 }));
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartAPI({ ...item, quantity: item.quantity - 1 }));
    }
  };

  const totalSelectedPrice = selectItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (!cartItems) return null;

  return (
    <section className="containermb xl:container mt-12">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-1/4 p-2 text-left">Product</th>
              <th className="w-1/4 p-2 text-left">Price</th>
              <th className="w-1/4 p-2 text-left">Quantity</th>
              <th className="w-32 p-2">Total</th>
              <th className="w-12 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border-y border-gray-300">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <img
                      src={item.images}
                      alt="product"
                      className="w-14 h-14 object-contain"
                    />
                    <button onClick={() => navigate(`/product/${item.id}`)}>
                      <span className="text-blue-700 font-medium line-clamp-2 max-w-[160px] hover:text-red-500 break-words">
                        {item.description}
                      </span>
                    </button>
                  </div>
                </td>
                <td className="p-2 border-y border-gray-300">
                  <div className="text-gray-600 text-lg font-semibold">
                    ${item.price}
                  </div>
                </td>
                <td className="p-2 border-y border-gray-300 font-medium">
                  <div className="flex gap-5 items-center">
                    <button
                      onClick={() => increaseQuantity(item)}
                      className="border font-extrabold rounded-full p-2 w-8 h-8 bg-gray-200 hover:text-red-600"
                    >
                      +
                    </button>
                    <span className="font-extrabold text-red-600">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => decreaseQuantity(item)}
                      className="border font-extrabold rounded-full p-2 w-8 h-8 bg-gray-200 hover:text-red-600"
                    >
                      -
                    </button>
                  </div>
                </td>
                <td className="p-2 border-y border-gray-300">
                  <span className="text-gray-600 text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </td>
                <td className="p-2 border-y border-gray-300 text-center">
                  <div className="flex gap-4 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectItems.some((i) => i.id === item.id)}
                      onChange={() => handleSelectItem(item)}
                    />
                    <button
                      onClick={() => handleDeleteCart(item)}
                      className="hover:text-red-600"
                    >
                      X
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total + Checkout */}
      <div className="grid grid-cols-1 md:flex md:justify-end items-baseline md:gap-20">
        <span className="text-xl font-bold text-gray-600 mt-5">
          Total: ${totalSelectedPrice.toFixed(2)}
        </span>
        <button
          onClick={() =>
            navigate("/checkout", { state: { selectItems: selectItems } })
          }
          className="bg-red-600 mt-5 text-white font-bold rounded-lg w-full py-3 md:w-1/5 hover:bg-blue-950 duration-100 hover:duration-500"
        >
          Check out
        </button>
      </div>
    </section>
  );
};

export default Cart;
