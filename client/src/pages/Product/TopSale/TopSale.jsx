import React from "react";
import product1 from "../../../assets/img/product-1.jpg";
import TopSaleCenter from "./TopSaleCenter/TopSaleCenter";
import ListTopSale from "./ListTopSale/ListTopSale";

const TopSale = () => {
  return (
    <section className="mt-8 lg:mt-10 xl:mt-12 container mx-auto px-4">
      {/* Tiêu đề */}
      <div className="flex gap-5 mb-3">
        <p
          className=" font-bold text-2xl hover:text-red-600 duration-150 hover:duration-700 transition-all"
          href=""
        >
          TopSale
        </p>
      </div>
      <hr className="mb-6" />
      {/* Product  */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center gap-6">
        {/* Center  */}
        <div className="order-1 md:col-span-2 xl:order-2 ">
          <TopSaleCenter />
        </div>

        <div className="order-2 xl:order-1 mt-4 ">
          <ListTopSale />
        </div>

        <div className="hidden md:block md:order-3 xl:order-3 mt-4">
          <ListTopSale />
        </div>
      </div>
    </section>
  );
};

export default TopSale;
