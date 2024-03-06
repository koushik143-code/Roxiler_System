const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    sold: Boolean,
    dateOfSale: Date,
    month: String //as getting month
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = {
    TransactionModel
}
