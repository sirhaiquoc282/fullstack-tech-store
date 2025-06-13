const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};


const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    let errorMessage = err.message;

    switch (err.name) {
        case 'CastError':
            errorMessage = `Resource not found. Invalid ID: ${err.value}`;
            res.status(400);
            break;
        case 'ValidationError':
            errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
            res.status(400);
            break;
        case 'MongoServerError':
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                errorMessage = `Duplicate field value: '${err.keyValue[field]}' for field '${field}'. Please use another value.`;
                res.status(409);
            }
            break;
        case 'JsonWebTokenError':
            errorMessage = 'Invalid token. Please log in again.';
            res.status(401);
            break;
        case 'TokenExpiredError':
            errorMessage = 'Token has expired. Please log in again.';
            res.status(401);
            break;
        default:
            break;
    }

    res.json({
        success: false,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};