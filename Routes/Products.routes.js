const express = require("express");

const { TransactionModel } = require('../Models/Transaction');

const axios = require('axios');
const productsRouter = express.Router();

// Function to get month name from month number
const getMonthName = (monthNumber) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
};


productsRouter.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        
        //We want Month in data
        const transactionsWithMonth = response.data.map(transaction => {
            const dateOfSale = new Date(transaction.dateOfSale);
            const month = getMonthName(dateOfSale.getMonth() + 1); // Get month as string
            return { ...transaction, month };
        });

        // Check the count of existing documents
        const count = await TransactionModel.countDocuments();

        // If the count is less than 60, insert transactions
        if (count < 60) {
            await TransactionModel.insertMany(transactionsWithMonth);
            res.send(TransactionModel);
        } else {
            const existingData = await TransactionModel.find();
            res.json(existingData);
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = {
    productsRouter
}

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Fetch product transactions
 *     description: Fetches product transactions from a third-party API and inserts them into the database if necessary. And Add the month from date.
 *     responses:
 *       200:
 *         description: Successfully fetched product transactions
 *       500:
 *         description: Internal server error
*/
