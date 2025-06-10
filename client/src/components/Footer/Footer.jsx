import React from "react";
import logo from '../../assets/img/logo.png'
const Footer = () => {
  return (
    <div>
      <footer className="bg-[#FAFAFA] mt-8 lg:mt-10 xl:mt-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-2 container gap-5">
          <div className="mt-8 lg:mt-10 xl:mt-12">
            <div className="w-24">
              <img src={logo} alt="logo" />
            </div>
            <p className="mt-6 font-light text-base">
              QDA chuyên máy ảnh laptop đồ điện tử...
            </p>
          </div>

          <div className="mt-2 lg:mt-10 xl:mt-12">
            <p className="font-semibold text-2xl">Contact</p>
            <div className="mt-2 lg:mt-3 xl:mt-5">
              <div className="flex gap-2 items-center">
                <i className="fas fa-map-signs"></i>
                <div className="w-px h-6 bg-gray-300 mr-7"></div>
                <p>141 Chiến Thắng, Tân Triều, Thanh Trì, Hà Nội</p>
              </div>
            </div>
            <div className="mt-2 lg:mt-3 xl:mt-5">
              <div className="flex gap-2 items-center">
                <i className="fas fa-phone"></i>
                <div className="w-px h-6 bg-gray-300 mr-7"></div>
                <p>1234567899</p>
              </div>
            </div>
            <div className="mt-2 lg:mt-3 xl:mt-5">
              <div className="flex gap-2 items-center">
                <i className="fas fa-envelope-open"></i>
                <div className="w-px h-6 bg-gray-300 mr-7"></div>
                <p>qda@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mt-2 lg:mt-10 xl:mt-12 flex flex-col">
            <p className="font-semibold text-2xl">Categories</p>
            <a href="" className="mt-2 lg:mt-3 xl:mt-5">
              Laptops & Computers
            </a>
            <a href="" className="mt-2 lg:mt-3 xl:mt-5">
              Cameras & Photography
            </a>
            <a href="" className="mt-2 lg:mt-3 xl:mt-5">
              Smart Phones
            </a>
            <a href="" className="mt-2 lg:mt-3 xl:mt-5">
              Tablets & Ipad
            </a>
          </div>

          <div className="mt-12 grid-cols-1 xl:grid-cols-2">
            <h3 className="font-bold text-2xl">
              10% cho đơn hàng đầu tiên
            </h3>
            <p className="mt-3">
              Hãy là người đầu tiên biết về các ưu đãi, sản phẩm mới và các sản
              phầm giảm giá
            </p>

            <div className="xl:flex gap-8 mt-2 lg:mt-3 xl:mt-5">
              <input
                className="outline-none border-[1px] border-black focus:border-red-700 focus:scale-105 duration-150 focus:duration-800 pl-3 px-36 py-3 rounded-full"
                type="text"
                placeholder="Enter your email address"
              />
              <button className="border-[1px] rounded-full py-3 px-32 mt-3 xl:mt-0 xl:py-3 xl:px-12 bg-red-700 text-white hover:bg-blue-800 duration-200 hover:duration-9000 hover:scale-110 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="mb-6 mt-3" />
        <div className="container text-center mb-3">
          <p>
            QDA uy tín, nhiệt tình vì khách hàng{" "}
            <i className="fas fa-heart" style={{ color: "#dd1d1d" }}></i>
          </p>
          <div className="flex gap-6 justify-center mt-3">
            {/* Facebook */}
            <a
              href="#"
              className="border border-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* TikTok */}
            <a
              href="#"
              className="border border-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition"
            >
              <i className="fab fa-tiktok"></i>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="border border-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-violet-600 hover:text-white transition"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
