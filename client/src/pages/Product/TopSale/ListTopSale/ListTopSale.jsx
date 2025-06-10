import React, { useState, useEffect } from "react";
import apiService from "../../../../service/apiService";
import BoxTopSale from "./BoxTopSale";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const ListTopSale = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDataProduct = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProduct();
      if (res.status === 200) {
        setProduct(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataProduct();
  }, []);

  return (
    <div className="w-full xl:col-span-1 order-2 xl:order-1 px-2">
      {loading ? (
        <Box sx={{ width: 300 }}>
          <Skeleton variant="rectangular" height={100} className="mb-2" />
          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="60%" />
        </Box>
      ) : (
        product.slice(0, 4).map((item, i) => (
          <div key={i} className="mb-4">
            <BoxTopSale item={item} />
            <hr className="my-4" />
          </div>
        ))
      )}
    </div>
  );
};

export default ListTopSale;
