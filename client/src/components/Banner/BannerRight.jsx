import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import arrow icons

// Import specific banner images
// You specified 690x300, which is the aspect ratio we will maintain.
import bannerXiaomi from '../../assets/img/690x300-Xiaomi-Vacuum-X20-0525.webp';
import bannerIphone from '../../assets/img/iphone-16-pro-max-home.webp';
import bannerOppo from '../../assets/img/Oppo-Reno14-Sliding-home.webp';

const BannerRight = () => {
  const navigate = useNavigate();
  // Array of hardcoded banner image objects (no titles or button text)
  const bannerImages = [
    { src: bannerXiaomi, alt: "Xiaomi Vacuum X20 Sale" },
    { src: bannerIphone, alt: "iPhone 16 Pro Max" },
    { src: bannerOppo, alt: "Oppo Reno14 Sliding" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null); // Ref to hold the interval ID for auto-play

  useEffect(() => {
    // Start auto-play when component mounts or bannerImages change
    if (bannerImages.length > 0) {
      // Clear any existing interval to prevent multiple intervals running
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
      }, 5000); // Auto-advance every 5 seconds
    }

    // Cleanup function: Clear the interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bannerImages.length]); // Re-run effect if number of banners changes

  /**
   * Navigates to the previous slide. Resets auto-play timer.
   */
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    // Reset auto-play timer after manual interaction
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
    }
  };

  /**
   * Navigates to the next slide. Resets auto-play timer.
   */
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    // Reset auto-play timer after manual interaction
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
    }
  };


  const currentBanner = bannerImages[currentIndex];

  if (!currentBanner) {
    return (
      // Placeholder for loading state, maintaining the aspect ratio
      <div className="lg:col-span-3 w-full aspect-[690/300] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        Loading Banners...
      </div>
    );
  }

  return (
    <div className="
      relative lg:col-span-3 w-full 
      aspect-[690/300] /* Use aspect ratio to maintain original image proportion */
      overflow-hidden rounded-lg shadow /* Apply consistent styling */
    ">
      <img   
        onClick={() => navigate("/shop")}

        src={currentBanner.src}
        alt={currentBanner.alt}

        className="w-full h-full object-contain cursor-pointer"
      />

      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2
                   w-10 h-10 rounded-full flex items-center justify-center
                   bg-white bg-opacity-30 hover:bg-opacity-50
                   z-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
        aria-label="Previous banner"
      >
        <FiChevronLeft size={24} className="text-gray-800" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   w-10 h-10 rounded-full flex items-center justify-center
                   bg-white bg-opacity-30 hover:bg-opacity-50
                   z-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
        aria-label="Next banner"
      >
        <FiChevronRight size={24} className="text-gray-800" />
      </button>
    </div>
  );
};

export default BannerRight;