import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../store/features/CartSlice";
import { deleteWishList } from "../../store/features/WishListSlice";
import { useNavigate } from "react-router-dom";
const WishList = () => {
  const isLogin = useSelector((state) => state.authenSlice.isLogin);
  const reduxDispatch = useDispatch();
  const navigate = useNavigate()
  const handleAddToCart = (product) => {
    if (isLogin) {
      reduxDispatch(
        addToCart({
          ...product,
          quantity: 1,
        })
      );
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    }
  };
  const dispatch = useDispatch();
  const wishItems = useSelector((state) => state.WishListSlice.wishItems);
 const handleDeleWishList = ((product)=>{
    reduxDispatch(deleteWishList(product))
 })

  if (!wishItems) {
    return <></>;
  }

  return (
    <section className="container mt-12">
      <div className="w-full overflow-x-auto">
        <table className="w-full border min-w-[700px] border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-12 p-2 border border-gray-300"></th>
              <th className="w-1/4 p-2 border border-gray-300 text-left">
                Product
              </th>
              <th className="w-1/4 p-2 border border-gray-300 text-left">
                Unit Price
              </th>
              <th className="w-1/4 p-2 border border-gray-300 text-left">
                Stock Status
              </th>
              <th className="w-32 p-2 border border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {wishItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300 text-center">
                  <button
                  onClick={()=>handleDeleWishList(item)}
                  className="hover:text-red-600">X</button>
                </td>
                <td className="p-2 border border-gray-300">
                  <a className="flex items-center gap-3 cursor-pointer">
                    <img
                      src={item.images}
                      alt="product"
                      className="w-14 h-14 object-contain"
                    />
                    <button onClick={() => navigate(`/product/${item.id}`)}>
                    <span className="text-blue-700 font-medium line-clamp-2 max-w-[160px] hover:text-red-500 break-words">
                      {item.description}
                    </span></button>
                  </a>
                </td>
                <td className="p-2 border border-gray-300">
                  <div className="flex gap-2 text-sm items-center">
                    <span className="text-red-600 text-lg xl:text-2xl font-semibold">
                      {item.price}
                    </span>
                    <span className="line-through text-xs xl:text-sm text-gray-500">
                      {item.price + item.rating}
                    </span>
                  </div>
                </td>
                <td className="p-2 border border-gray-300 text-green-600 font-medium">
                  {item.stock}
                </td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2 bg-blue-950 font-semibold text-white rounded hover:bg-red-600 duration-100 hover:duration-500 transition"
                  >
                    Add To Cart
                  </button>
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
