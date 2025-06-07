const userRouter = require('./user');
const productRouter = require('./product'); // Đã import đúng
const orderRoutes = require('./order');

const { notFound, errorHandler } = require('../middlewares/errorHandler');

const initRoutes = (app) => {
    app.use('/api/v1/user', userRouter);      // Route cho user
    app.use('/api/v1/product', productRouter); // ✅ Route cho sản phẩm
    app.use('/api/orders', orderRoutes);
    app.use(notFound);     // Middleware xử lý route không tồn tại
    app.use(errorHandler); // Middleware xử lý lỗi chung
}
