import React from "react";
import logo from '../../assets/img/logo.png';

const Footer = () => {
  return (
    <footer className="
      bg-gray-100
      mt-8                 /* Giảm margin-top từ 16 xuống 8 */
      py-8 lg:py-12        /* Giảm padding top/bottom */
    ">
      <div className="
        container mx-auto
        px-4
      ">
        {/* Phần trên của Footer */}
        <div className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5
          gap-y-8 gap-x-6   /* Giảm khoảng cách giữa các cột */
          pb-8              /* Giảm padding bottom */
          border-b border-gray-300
        ">
          {/* Cột 1: Logo và Giới thiệu */}
          <div className="
            col-span-1 md:col-span-2 xl:col-span-1
          ">
            <div className="w-28"> {/* Giảm kích thước logo */}
              <img src={logo} alt="QDA Logo" className="w-full h-auto" />
            </div>
            <p className="
              mt-4            /* Giảm margin-top */
              text-gray-700
              text-sm         /* Giảm kích thước chữ */
              leading-relaxed
            ">
              QDA chuyên cung cấp các sản phẩm điện tử chất lượng cao như máy ảnh, laptop, điện thoại và nhiều hơn nữa.
            </p>
          </div>

          {/* Cột 2: Contact */}
          <div className="col-span-1">
            <h3 className="
              font-bold text-lg /* Giảm kích thước tiêu đề */
              text-gray-800
              mb-3            /* Giảm margin-bottom */
            ">Contact</h3>
            <div className="space-y-3"> {/* Giảm khoảng cách */}
              <div className="flex items-start gap-2"> {/* Giảm gap */}
                <i className="fas fa-map-marker-alt text-blue-600 mt-1"></i>
                <p className="text-gray-700 text-sm">141 Chiến Thắng, Tân Triều, Thanh Trì, Hà Nội</p>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-phone text-blue-600"></i>
                <p className="text-gray-700 text-sm">0123 456 789</p>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope text-blue-600"></i>
                <p className="text-gray-700 text-sm">contact@qda.com</p>
              </div>
            </div>
          </div>

          {/* Cột 3: Categories */}
          <div className="col-span-1">
            <h3 className="
              font-bold text-lg
              text-gray-800
              mb-3
            ">Categories</h3>
            <nav className="flex flex-col space-y-2"> {/* Giảm khoảng cách */}
              <a href="#" className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                Laptops & Computers
              </a>
              <a href="#" className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                Cameras & Photography
              </a>
              <a href="#" className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                Smart Phones
              </a>
              <a href="#" className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                Tablets & iPad
              </a>
            </nav>
          </div>

          {/* Cột 4 & 5: Newsletter */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <h3 className="
              font-bold text-lg
              text-gray-800
              mb-2
            ">
              Giảm 10% cho đơn hàng đầu tiên!
            </h3>
            <p className="text-gray-700 text-sm mb-3"> {/* Giảm kích thước chữ */}
              Hãy là người đầu tiên biết về các ưu đãi đặc biệt, sản phẩm mới và các chương trình giảm giá hấp dẫn.
            </p>

            <div className="flex flex-col sm:flex-row gap-3"> {/* Giảm gap */}
              <input
                className="
                  flex-grow
                  outline-none
                  border border-gray-300
                  focus:border-blue-500
                  py-2 px-4               /* Giảm padding */
                  rounded-full
                  text-sm                 /* Giảm kích thước chữ */
                "
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
              />
              <button className="
                shrink-0
                bg-blue-600
                text-white
                font-semibold
                py-2 px-4                 /* Giảm padding */
                rounded-full
                hover:bg-blue-700
                text-sm                   /* Giảm kích thước chữ */
              ">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Phần dưới của Footer */}
        <div className="
          flex flex-col md:flex-row
          items-center
          justify-between
          pt-5                      /* Giảm padding top */
        ">
          <p className="text-gray-600 text-xs mb-3 md:mb-0"> {/* Giảm kích thước chữ */}
            &copy; {new Date().getFullYear()} QDA. Tất cả quyền được bảo lưu.{" "}
            <i className="fas fa-heart text-red-500"></i>
          </p>
          <div className="flex gap-3"> {/* Giảm khoảng cách */}
            {/* Facebook */}
            <a href="#" className="
              border border-gray-300
              rounded-full
              w-8 h-8              /* Giảm kích thước icon */
              flex items-center justify-center
              text-gray-600
              hover:bg-blue-600 hover:text-white hover:border-blue-600
              text-sm               /* Giảm kích thước icon */
            ">
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* TikTok */}
            <a href="#" className="
              border border-gray-300
              rounded-full
              w-8 h-8
              flex items-center justify-center
              text-gray-600
              hover:bg-black hover:text-white hover:border-black
              text-sm
            ">
              <i className="fab fa-tiktok"></i>
            </a>

            {/* Instagram */}
            <a href="#" className="
              border border-gray-300
              rounded-full
              w-8 h-8
              flex items-center justify-center
              text-gray-600
              hover:bg-fuchsia-600 hover:text-white hover:border-fuchsia-600
              text-sm
            ">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;