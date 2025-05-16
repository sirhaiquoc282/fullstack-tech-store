const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/dbconnect');
const initRoutes = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRoutes(app);

app.use('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})