import axios from "axios";
import {
  API_CATEGORIES,
  API_PRODUCT,
  API_LIST_CATEGORIES
} from "../constants/api";

const apiService = {
  getAllCategories: async () => {
    const res = await axios.get(API_CATEGORIES);
    return res.data;
  },

  getProduct: async (params) => {
    return await axios.get(API_PRODUCT, { params });
  },

  getProductDetail: async (id) => {
    return await axios.get(`${API_PRODUCT}/${id}`);
  },

  getProductByCategories: async (categoryId, params) => {
    return await axios.get(API_PRODUCT, {
      params: {
        ...params,
        category: categoryId,
      },
    });
  },

  getListCategories: async () => {
    return await axios.get(API_LIST_CATEGORIES);
  },

  getShearchProduct: async (params) => {
    return await axios.get(`${API_PRODUCT}/search`, { params });
  },
};

export default apiService;
