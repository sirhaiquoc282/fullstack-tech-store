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
  API_DELETE_PAYMENT_METHOD
} from "../constants/api";
import axiosInstance from "../store/axiosInstance";

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

  getShearchProduct: async (params) => {
    return await axios.get(API_PRODUCT, { params });
  }

};

export default apiService;
