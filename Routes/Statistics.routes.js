const express = require('express');
const { TransactionModel } = require('../Models/Transaction');

const statisticsRouter = express.Router();


statisticsRouter.get('/', async (req, res) => {
    try {
        const month = req.query.month;
        console.log('month:', month)
       // Calculate statistics for the selected month
       const totalSaleAmountResult = await TransactionModel.aggregate([
        { $match: { month: month, sold: true } }, // Match only sold items for the selected month
        { $group: { _id: null, total: { $sum: "$price" } } }
    ]);


    const totalSoldItems = await TransactionModel.countDocuments({ month: month, sold: true });
    const totalNotSoldItems = await TransactionModel.countDocuments({ month: month, sold: false });

    // Extract total sale amount from aggregation result
    const totalSaleAmount = totalSaleAmountResult.length > 0 ? totalSaleAmountResult[0].total : 0;
    
        res.json({
            totalSaleAmount: totalSaleAmount,
            totalSoldItems: totalSoldItems,
            totalNotSoldItems: totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = {
    statisticsRouter
};

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Get statistics for the selected month
 *     description: Returns total sale amount, total number of sold items, and total number of not sold items for the selected month
 *     parameters:
 *       - in: query
 *         name: month
 *         description: The selected month (e.g., January, February, etc.)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistics for the selected month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSaleAmount:
 *                   type: number
 *                   description: Total sale amount of selected month
 *                 totalSoldItems:
 *                   type: integer
 *                   description: Total number of sold items of selected month
 *                 totalNotSoldItems:
 *                   type: integer
 *                   description: Total number of not sold items of selected month
 *       500:
 *         description: Internal server error
 */