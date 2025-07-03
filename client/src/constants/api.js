export const API_CATEGORIES = "http://localhost:5000/api/categories";

export const API_PRODUCT = "http://localhost:5000/api/products";

export const API_BY_CATEGORY = "http://localhost:5000/api/categories";


export const API_LIST_CATEGORIES = 'http://localhost:5000/api/categories'

export const API_DASHBOARD_STATS = 'http://localhost:5000/api/users/dashboard-stats'

export const API_MY_ORDERS = 'http://localhost:5000/api/orders/my-orders'

export const API_GET_PAYMENT_METHODS = 'http://localhost:5000/api/users/payment-methods'
export const API_ADD_PAYMENT_METHOD = 'http://localhost:5000/api/users/payment-methods'
export const API_UPDATE_PAYMENT_METHOD = (cardId) => `http://localhost:5000/api/users/payment-methods/${cardId}`
export const API_DELETE_PAYMENT_METHOD = (cardId) => `http://localhost:5000/api/users/payment-methods/${cardId}`
export const API_DELETE_PRODUCT = (id) => `http://localhost:5000/api/products/${id}`;
export const UPLOAD_ALL_IMAGES_ENDPOINT = 'http://localhost:5000/api/upload/'; // <--- ĐÃ SỬA TẠI ĐÂY!
export const API_DELETE_IMAGE = `http://localhost:5000/api/upload`;