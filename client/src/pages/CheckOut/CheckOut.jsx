import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckOut = () => {
  const location = useLocation();
  const selectItems = location.state?.selectItems || [];
  const navigate = useNavigate();
  const shipping = 30;
  const subtotal = selectItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = shipping + subtotal;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [err, setErr] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const { name, phone, email, address } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const newErr = {};

    if (!name.trim()) {
      newErr.name = "Tên không được để trống!";
    }

    if (!phone.trim()) {
      newErr.phone = "Số điện thoại không được để trống!";
    } else if (!phoneRegex.test(phone)) {
      newErr.phone = "Số điện thoại không hợp lệ (10 chữ số)!";
    }

    if (!email.trim()) {
      newErr.email = "Email không được để trống!";
    } else if (!emailRegex.test(email)) {
      newErr.email = "Email không hợp lệ!";
    }

    if (!address.trim()) {
      newErr.address = "Địa chỉ không được để trống!";
    }

    setErr(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (selectItems.length !==0) {
      if (validate()) {
        toast.success(
          "Cảm ơn bạn đã tin tưởng và đặt hàng bên shop. Đơn hàng sẽ được gia tới bạn trong thời gian sớm nhất ;)",
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
        });
        navigate("/");
      }
    } else {
      toast.error("Vui lòng chọn sản phẩm !", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/carts");
    }
  };

  return (
    <section className="containermb xl:container mt-12">
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border px-2 py-3 outline-none focus:border-red-600"
            type="text"
            placeholder="Tên"
          />
          {err.name && <p className="text-red-600 text-sm">{err.name}</p>}

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border px-2 py-3 outline-none focus:border-red-600"
            type="text"
            placeholder="Số điện thoại"
          />
          {err.phone && <p className="text-red-600 text-sm">{err.phone}</p>}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border px-2 py-3 outline-none focus:border-red-600"
            type="email"
            placeholder="Email"
          />
          {err.email && <p className="text-red-600 text-sm">{err.email}</p>}

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border px-2 py-3 outline-none focus:border-red-600"
            type="text"
            placeholder="Địa chỉ"
          />
          {err.address && <p className="text-red-600 text-sm">{err.address}</p>}
        </div>
        <div className="w-full">
          <textarea
            className="border px-2 py-3 resize-none outline-none w-full focus:border-red-600"
            placeholder="Ghi chú đơn hàng (nếu có)..."
          ></textarea>
        </div>
      </form>

      <div className="mt-6 w-full">
        <span className="font-bold text-xl">Your order</span>
        <table className="table-auto w-full border border-gray-300 mb-4 mt-4">
          <thead>
            <tr>
              <th className="w-1/2 border border-gray-300">Product</th>
              <th className="w-1/2 border border-gray-300">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {selectItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-200">
                <td className="p-2 border border-gray-300">{item.title}</td>
                <td className="p-2 border border-gray-300">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2">
          <span className="text-gray-600 font-medium text-lg">Shipping</span>
          <span className="text-gray-600 font-medium text-lg">${shipping}</span>
        </div>

        <hr className="border border-gray-300 mt-2" />

        <div className="grid grid-cols-2 mt-2">
          <span className="text-red-600 font-medium text-lg">Total</span>
          <span className="text-red-600 font-medium text-lg">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-3 lg:w-1/6 py-2 bg-blue-950 text-white font-bold hover:bg-red-600 duration-200 hover:duration-500 w-full"
        >
          Place Order
        </button>
      </div>
    </section>
  );
};

export default CheckOut;
