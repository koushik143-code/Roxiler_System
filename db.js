const mongoose = require("mongoose");
require('dotenv').config()
// const connection = mongoose.connect(process.env.mongoURL)
 const connection = mongoose.connect("mongodb://103.175.63.14/assignment")
     
module.exports = {
    connection
}