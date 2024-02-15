const mongoose = require("mongoose");
require('dotenv').config();


// constant URLs 
const mongoUrl = process.env.MONGO_URL ;


//Database connection
const connectDB = mongoose.connect(mongoUrl).then(() => console.log("database connected")).catch((err) => console.log("database error: ", err));

module.exports = {connectDB};