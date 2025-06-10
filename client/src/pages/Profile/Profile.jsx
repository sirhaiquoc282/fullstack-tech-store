import React, { useState } from "react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Form submitted:", form);
  };

  return (
    <div className="flex items-center justify-center  mt-10 bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Information</h2>

        <input
          name="name"
          type="text"
          placeholder="Name*"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone*"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          name="address"
          type="text"
          placeholder="Address*"
          value={form.address}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          UPDATE PROFILE
        </button>
      </form>
    </div>
  );
};

export default Profile;
