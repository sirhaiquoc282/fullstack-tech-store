import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Ensure ToastContainer is configured in App.js
import { FiUser, FiPhone, FiMail, FiMapPin, FiShoppingBag, FiCreditCard } from "react-icons/fi"; // Import icons

const CheckOut = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || []; // Renamed selectItems to selectedItems
  const navigate = useNavigate();
console.log(selectedItems, "selectedItems");

  // Calculate shipping fee and total amount
  const shippingFee = selectedItems.length > 0 ? 300000 : 0; // Shipping fee $30, or $0 if no items
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalAmount = subtotal + shippingFee;

  const [formData, setFormData] = useState({
    fullName: "", // Renamed 'name' to 'fullName' for clarity
    phone: "",
    email: "",
    address: "",
    orderNotes: "",
    paymentMethod: "cod", // Default payment method is Cash on Delivery
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => { // Renamed 'validate' to 'validateForm' for clarity
    const { fullName, phone, email, address } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/; // Basic phone regex for 10-11 digits (adjust as needed)
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name cannot be empty!";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number cannot be empty!";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Invalid phone number (10-11 digits expected)!";
    }

    if (!email.trim()) {
      newErrors.email = "Email cannot be empty!";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format!";
    }

    if (!address.trim()) {
      newErrors.address = "Address cannot be empty!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("Your cart is empty. Please add products to proceed!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      navigate("/carts");
      return;
    }

    if (validateForm()) { // Use validateForm
      // Logic to send order data to backend goes here
      console.log("Order Data:", {
        customerInfo: formData,
        items: selectedItems,
        subtotal: subtotal,
        shipping: shippingFee,
        total: totalAmount,
        paymentMethod: formData.paymentMethod,
      });

      toast.success(
        "Thank you for your order! Your order will be delivered as soon as possible.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        }
      );
      // Reset form after successful order (if needed)
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        orderNotes: "",
        paymentMethod: "cod",
      });
      // Navigate to order confirmation page
      navigate("/order-confirmation");
    } else {
      toast.error("Please review your information. There are errors in the form!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  // Format currency to USD (example)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { // Changed to en-US for USD
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2, // USD typically uses 2 decimal places
    }).format(amount);
  };

  return (
    <section className="
      container mx-auto px-4 py-8 lg:py-12
      bg-gray-50
    ">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 lg:mb-12">
        Checkout
      </h1>

      <div className="
        grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12
        max-w-6xl mx-auto
      ">
        {/* Left Column: Shipping Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Shipping Information</h2>
          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-1">Full Name <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`
                    w-full px-4 pl-10 py-2 border rounded-lg outline-none
                    focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 text-gray-800
                    ${errors.fullName ? 'border-red-500' : 'border-gray-300'}
                  `}
                  type="text"
                  placeholder="Enter your full name"
                />
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Phone Number <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`
                    w-full px-4 pl-10 py-2 border rounded-lg outline-none
                    focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 text-gray-800
                    ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                  `}
                  type="text"
                  placeholder="Enter your phone number (e.g., 0123456789)"
                />
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-4 pl-10 py-2 border rounded-lg outline-none
                    focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 text-gray-800
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}
                  `}
                  type="email"
                  placeholder="Enter your email address"
                />
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">Address <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`
                    w-full px-4 pl-10 py-2 border rounded-lg outline-none
                    focus:ring-2 focus:ring-red-700 focus:border-red-700
                    transition-all duration-200 text-gray-800
                    ${errors.address ? 'border-red-500' : 'border-gray-300'}
                  `}
                  type="text"
                  placeholder="Enter your shipping address (House number, Street, Ward, District, City)"
                />
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Order Notes */}
            <div>
              <label htmlFor="orderNotes" className="block text-gray-700 text-sm font-medium mb-1">Order Notes (optional)</label>
              <textarea
                name="orderNotes"
                id="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                rows="4"
                className="
                  w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-y
                  focus:ring-2 focus:ring-red-700 focus:border-red-700
                  transition-all duration-200 text-gray-800
                "
                placeholder="e.g., Deliver in the evening, call before arrival..."
              ></textarea>
            </div>
          </form>

          {/* Payment Method */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-red-700 border-red-700 focus:ring-red-700"
                />
                <span className="flex items-center gap-2 text-lg text-gray-800 font-medium">
                  <FiShoppingBag className="text-red-700" /> Cash on Delivery (COD)
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-red-700 border-red-700 focus:ring-red-700"
                />
                <span className="flex items-center gap-2 text-lg text-gray-800 font-medium">
                  <FiCreditCard className="text-red-700" /> Credit/Debit Card
                  <span className="text-red-500 text-xs">(Coming soon)</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>

          {selectedItems.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Your cart is empty. Please go back to the cart to select products.</p>
          ) : (
            <div className="mb-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 whitespace-normal">
                          <p className="text-sm font-medium text-gray-900">{item.productId.title}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.price*(1-item.productId.discountPercentage))}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          x {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6 border-t pt-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping Fee</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-bold text-red-700 mb-6 border-t pt-4">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="
              w-full py-3 bg-red-700 text-white font-bold text-lg rounded-lg
              hover:bg-red-800 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2
            "
          >
            Place Order
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;