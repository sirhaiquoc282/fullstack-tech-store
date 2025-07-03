import axios from "axios";
import {
  API_CATEGORIES,
  API_PRODUCT,
  API_LIST_CATEGORIES,
  API_DASHBOARD_STATS,
  API_MY_ORDERS,
  API_GET_PAYMENT_METHODS,
  API_ADD_PAYMENT_METHOD,
  API_UPDATE_PAYMENT_METHOD,
  API_DELETE_PAYMENT_METHOD,
  UPLOAD_ALL_IMAGES_ENDPOINT,
  API_DELETE_IMAGE
} from "../constants/api";
import axiosInstance from "../store/axiosInstance";

const apiService = {
  getAllCategories: async () => {
    const res = await axios.get(API_CATEGORIES);
    return res.data;
  },
  createCategory: async (data) => {
    return await axiosInstance.post(API_CATEGORIES, data);
  },
  updateCategory: async (id, data) => {
    return await axiosInstance.put(`${API_CATEGORIES}/${id}`, data);
  },
  deleteCategory: async (id) => {
    return await axiosInstance.delete(`${API_CATEGORIES}/${id}`);
  },
  getProduct: async (params) => {
    return await axios.get(API_PRODUCT, { params });
  },
  getAllProducts: async (params) => {
    return await axiosInstance.get(API_PRODUCT, params);
  },
  createProduct: async (data) => {
    return await axiosInstance.post(API_PRODUCT, data);
  },
  updateProduct: async (id, data) => {
    return await axiosInstance.put(`${API_PRODUCT}/${id}`, data);
  },
  uploadImages: async (formData) => {
    return await axiosInstance.post(UPLOAD_ALL_IMAGES_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: async (id) => {
    return await axiosInstance.delete(`${API_DELETE_IMAGE}/${id}`);
  },
  getProductDetail: async (id) => {
    return await axios.get(`${API_PRODUCT}/${id}`);
  },
  getUserDashboardStats: async () => {
    return await axiosInstance.get(API_DASHBOARD_STATS)
  },
  getUserOrders: async () => {
    return axiosInstance.get(API_MY_ORDERS)
  },
  getProductByCategories: async (categoryId, params) => {
    return await axios.get(API_PRODUCT, {
      params: {
        ...params,
        category: categoryId,
      },
    });
  },

  getUserPaymentMethods: async () => {
    return axiosInstance.get(API_GET_PAYMENT_METHODS)
  },
  addPaymentMethod: async (cardData) => {
    return axiosInstance.post(API_ADD_PAYMENT_METHOD, cardData)
  },
  updatePaymentMethod: async (cardId, cardData) => {
    return axiosInstance.put(API_UPDATE_PAYMENT_METHOD(cardId), cardData)
  },
  deletePaymentMethod: async (cardId) => {
    return axiosInstance.delete(API_DELETE_PAYMENT_METHOD(cardId))
  },
  getListCategories: async () => {
    return await axios.get(API_LIST_CATEGORIES);
  },
  deleteProduct: async (productId) => {
    return await axiosInstance.delete(`${API_PRODUCT}/${productId}`);
  },
  getShearchProduct: async (params) => {
    return await axios.get(API_PRODUCT, { params });
  }

};

export default apiService;
