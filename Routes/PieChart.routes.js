const express = require('express');
const { TransactionModel } = require('../Models/Transaction');

const pieChartRouter = express.Router();


pieChartRouter.get('/', async (req, res) => {
    try {
        const month = req.query.month;
        const transactions = await TransactionModel.find({ month: month });

        // Count items for each category
        const categoryCounts = {};
        transactions.forEach(transaction => {
            const category = transaction.category;
            if (!categoryCounts[category]) {
                categoryCounts[category] = 1;
            } else {
                categoryCounts[category]++;
            }
        });

        // Format the result
        const formattedResult = Object.keys(categoryCounts).map(category => ({
            category: category,
            count: categoryCounts[category]
        }));

        res.json({ categories: formattedResult });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = {
    pieChartRouter
};

/**
 * @swagger
 * /pie-chart:
 *   get:
 *     summary: Get data for pie chart
 *     description: Returns the number of items in each unique category for the selected month
 *     parameters:
 *       - in: query
 *         name: month
 *         description: The selected month (e.g., January, February, etc.)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data for the pie chart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   description: Unique categories and corresponding number of items
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         description: Category name
 *                       count:
 *                         type: integer
 *                         description: Number of items in the category
 *       500:
 *         description: Internal server error
 */
