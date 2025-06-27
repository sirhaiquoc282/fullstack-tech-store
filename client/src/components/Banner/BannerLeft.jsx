import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiService from "../../service/apiService";
// Updated imports for different icons, now using Font Awesome (Fa) icons
import {
  FaList,        // Replaced FiList
  FaLaptop,      // Replaced FiMonitor
  FaMobileAlt,   // Replaced FiSmartphone (FaMobileAlt is a common alternative)
  FaTabletAlt,   // Replaced FiTablet (FaTabletAlt is a common alternative)
  FaClock,       // Replaced FiWatch (FaClock is a generic watch/time icon)
  FaCamera,      // Replaced FiCamera
  // FaChevronRight // Removed: No longer needed as arrows are removed
} from "react-icons/fa"; // Changed import source to react-icons/fa

const BannerLeft = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
const [listCategories, setListCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const categories = [
    { id: 'laptop', name: 'Laptops', slug: 'laptop', icon: FaLaptop }, // Using FaLaptop
    { id: 'smartphone', name: 'Smartphones', slug: 'smartphone', icon: FaMobileAlt }, // Using FaMobileAlt
    { id: 'tablet', name: 'Tablets', slug: 'tablet', icon: FaTabletAlt }, // Using FaTabletAlt
    { id: 'smartwatch', name: 'Smartwatches', slug: 'smartwatch', icon: FaClock }, // Using FaClock
    { id: 'camera', name: 'Cameras', slug: 'camera', icon: FaCamera }, // Using FaCamera
  ];
useEffect(() => {
    const fetchListProduct = async () => {
      const res = await apiService.getListCategories();
      if (res.status === 200) {
        setListCategories(res.data);
      }
    };

    fetchListProduct();
  }, []);
  console.log(listCategories, "lisssss");
  
const handleClick = (item) => {
  setActiveCategory(item.slug);

  // Tìm trong listCategories phần tử có slug trùng với item.slug
  const matchedCategory = listCategories.find(
    (cat) => cat.slug === item.slug || cat.title.toLowerCase() === item.name.toLowerCase()
  );

  const realCategoryId = matchedCategory ? matchedCategory.id : item.id;

 const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("category", realCategoryId); 
    newSearchParams.delete("q"); // Nếu chọn category thì bỏ tìm kiếm
    newSearchParams.set("page", 1); // Reset về page 1
    navigate(`/shop?${newSearchParams.toString()}`);
};


  return (
    <div className="
      border border-gray-200 rounded-xl overflow-hidden
      shadow-lg hover:shadow-xl transition-shadow duration-300
      hidden lg:block
      bg-white
    ">
      {/* Reduced size of "All Departments" header */}
      <h2 className="
        bg-red-600 text-white font-bold px-6 py-3 /* Reduced py from 4 to 3 */
        rounded-t-xl flex items-center gap-3 /* Reduced gap from 4 to 3 */
        text-base uppercase tracking-wider select-none /* Reduced text-lg to text-base */
      ">
        <FaList size={18} className="text-white" /> {/* Using FaList */}
        <p>All Departments</p>
      </h2>

      <div
        className={`
          flex flex-col py-2
          ${categories.length > 10 ? "max-h-[480px] overflow-y-auto custom-scrollbar" : ""
          }
        `}
      >
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm px-6 py-3 text-center">No categories available.</p>
        ) : (
          categories.map((item) => (
            <div key={item.id}>
              <button
                className={`
                  w-full text-left px-6 py-3 flex items-center /* Removed justify-between as arrow is gone */ gap-4
                  transition-all duration-200 ease-in-out text-base
                  ${activeCategory === item.slug
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-100"
                  }
                  focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
                `}
                onClick={() => handleClick(item)}
              >
                <span className="flex items-center gap-3 flex-grow">
                  {/* Icon for each category item */}
                  {item.icon && <item.icon size={18} className="text-gray-500 flex-shrink-0" />}
                  <span>{item.name}</span>
                </span>
                {/* FaChevronRight Removed */}
              </button>
              {/* Removed: Horizontal rule (hr) that separates items */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerLeft;