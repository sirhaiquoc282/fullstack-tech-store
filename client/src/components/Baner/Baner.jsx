import React from "react";
import BanerLeft from "./BanerLeft";
import BanerRight from "./BanerRight";

const Baner = () => {
  return (
    <>
      <section className="mt-8 container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Cột 1: Menu */}
          <BanerLeft/>

          {/* Cột 2-4: Nội dung bên cạnh */}
          <BanerRight/>
        </div>
      </section>
    </>
  );
};

export default Baner;
