import React from 'react'

const Register = () => {
  return (
     <div className=" flex items-center justify-center  bg-white">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center">Đăng Ký</h2>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Tên đăng nhập*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Mật khẩu*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 text-white bg-black rounded-lg font-semibold hover:opacity-90 transition"
            >
              ĐĂNG KÝ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
