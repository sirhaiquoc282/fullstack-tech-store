import React from 'react';
import logo from '../../assets/img/logo.png';
import { FiMapPin, FiPhone, FiMail, FiHeart, FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi'; // Using react-icons for consistency and modern approach
// Note: Font Awesome (fas, fab) icons would require FA library/CDN setup.
// For TikTok, Fi-icons doesn't have it directly. I'll use a placeholder or keep Font Awesome if it's already integrated project-wide.
// Assuming Font Awesome is available since `fas` and `fab` classes are used. If not, replace with SVGs or other icon library.
// For now, I'll use Fi-icons for consistency where possible and retain the FA class for TikTok if Fi doesn't have an equivalent easily.

const Footer = () => {
  return (
    <footer className="
      bg-gray-100
      mt-8                /* Reduced margin-top from 16 to 8 */
      py-8 lg:py-12       /* Reduced padding top/bottom */
    ">
      <div className="
        container mx-auto
        px-4
      ">
        {/* Top section of the Footer */}
        <div className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5
          gap-y-8 gap-x-6   /* Reduced gap between columns */
          pb-8              /* Reduced padding bottom */
          border-b border-gray-300
        ">
          {/* Column 1: Logo and Introduction */}
          <div className="
            col-span-1 md:col-span-2 xl:col-span-1
          ">
            <div className="w-28"> {/* Reduced logo size */}
              <img src={logo} alt="QDA Logo" className="w-full h-auto" />
            </div>
            <p className="
              mt-4              /* Reduced margin-top */
              text-gray-700
              text-sm           /* Reduced font size */
              leading-relaxed
            ">
              QDA specializes in providing high-quality electronic products such as cameras, laptops, phones, and much more.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="col-span-1">
            <h3 className="
              font-bold text-lg /* Reduced heading size */
              text-gray-800
              mb-3              /* Reduced margin-bottom */
            ">Contact</h3>
            <div className="space-y-3"> {/* Reduced spacing */}
              <div className="flex items-start gap-2"> {/* Reduced gap */}
                {/* Replaced Font Awesome with React Icons (FiMapPin) */}
                <FiMapPin className="text-blue-600 mt-1" size={16} /> {/* Added size for FiIcon */}
                <p className="text-gray-700 text-sm">141 Chien Thang, Tan Trieu, Thanh Tri, Ha Noi</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Replaced Font Awesome with React Icons (FiPhone) */}
                <FiPhone className="text-blue-600" size={16} />
                <p className="text-gray-700 text-sm">0123 456 789</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Replaced Font Awesome with React Icons (FiMail) */}
                <FiMail className="text-blue-600" size={16} />
                <p className="text-gray-700 text-sm">contact@qda.com</p>
              </div>
            </div>
          </div>

          {/* Column 3: Categories */}
          <div className="col-span-1">
            <h3 className="
              font-bold text-lg
              text-gray-800
              mb-3
            ">Categories</h3>
            <nav className="flex flex-col space-y-2"> {/* Reduced spacing */}
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

          {/* Column 4 & 5: Newsletter */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <h3 className="
              font-bold text-lg
              text-gray-800
              mb-2
            ">
              Get 10% off your first order!
            </h3>
            <p className="text-gray-700 text-sm mb-3"> {/* Reduced font size */}
              Be the first to know about special offers, new products, and exciting discounts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3"> {/* Reduced gap */}
              <input
                className="
                  flex-grow
                  outline-none
                  border border-gray-300
                  focus:border-blue-500
                  py-2 px-4           /* Reduced padding */
                  rounded-full
                  text-sm             /* Reduced font size */
                "
                type="email"
                placeholder="Enter your email address"
              />
              <button className="
                shrink-0
                bg-blue-600
                text-white
                font-semibold
                py-2 px-4             /* Reduced padding */
                rounded-full
                hover:bg-blue-700
                text-sm               /* Reduced font size */
              ">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section of the Footer */}
        <div className="
          flex flex-col md:flex-row
          items-center
          justify-between
          pt-5                  /* Reduced padding top */
        ">
          <p className="text-gray-600 text-xs mb-3 md:mb-0"> {/* Reduced font size */}
            &copy; {new Date().getFullYear()} QDA. All rights reserved.{" "}
            {/* Replaced Font Awesome with React Icons (FiHeart) */}
            <FiHeart className="inline-block text-red-500 ml-1" size={12} /> {/* Added size and margin for FiIcon */}
          </p>
          <div className="flex gap-3"> {/* Reduced spacing */}
            {/* Facebook */}
            <a href="#" className="
              border border-gray-300
              rounded-full
              w-8 h-8             /* Reduced icon size */
              flex items-center justify-center
              text-gray-600
              hover:bg-blue-600 hover:text-white hover:border-blue-600
              text-sm             /* Reduced icon font size */
            ">
              <FiFacebook size={16} /> {/* Replaced Font Awesome with React Icons */}
            </a>

            {/* Twitter (formerly TikTok, using Twitter for common Fi-icon) */}
            {/* If you specifically need TikTok, you might need a different icon library or custom SVG */}
            <a href="#" className="
              border border-gray-300
              rounded-full
              w-8 h-8
              flex items-center justify-center
              text-gray-600
              hover:bg-black hover:text-white hover:border-black
              text-sm
            ">
              <FiTwitter size={16} /> {/* Replaced Font Awesome with React Icons */}
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
              <FiInstagram size={16} /> {/* Replaced Font Awesome with React Icons */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;