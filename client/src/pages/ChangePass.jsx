import React, {useState} from 'react'

const ChangePass = () => {
  const [form, setForm] = useState({
      passCurrent: "",
      newPass: "",
      passCofirm: "",
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
          <h2 className="text-2xl font-semibold text-center mb-8">Form đổi mật khẩu</h2>
  
          <input
            name="passCurrent"
            type="password"
            placeholder="Mật khẩu hiện tại*"
            value={form.passCurrent}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
  
          <input
            name="newPass"
            type="password"
            placeholder="Mật khẩu mới*"
            value={form.newPass}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
  
          <input
            name="passCofirm"
            type="password"
            placeholder="Nhập lại mật khẩu mới*"
            value={form.passCofirm}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
  
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    );
}

export default ChangePass
