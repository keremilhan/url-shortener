const mongoose = require('mongoose');

const connectDB = async url => {
    mongoose.set('strictQuery', true);
    return mongoose.connect(url);
};

module.exports = connectDB;
