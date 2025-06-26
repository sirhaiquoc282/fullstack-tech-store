import React from "react";
// Renamed BannerLeft and BannerRight for consistency
import BannerLeft from "./BannerLeft";
import BannerRight from "./BannerRight";

const Banner = () => { // Renamed from 'Baner' to 'Banner' for consistency
  return (
    <>
      <section className="mt-8 container mx-auto px-4"> {/* Added mx-auto and px-4 for centering and padding */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Column 1: Category Menu */}
          <BannerLeft />

          {/* Columns 2-4: Main Banner Carousel */}
          <BannerRight />
        </div>
      </section>
    </>
  );
};

export default Banner;
