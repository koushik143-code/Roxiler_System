const express = require('express');
const axios = require('axios');

const { TransactionModel } = require('../Models/Transaction');

const combinedDataRouter = express.Router();

// Helper function to fetch statistics
const fetchStatistics = async (month) => {
    // Implement logic to fetch statistics from the statistics endpoint
    // For example:
    const statisticsResponse = await axios.get(`http://localhost:8000/statistics?month=${month}`);
    // console.log('statisticsResponse:', statisticsResponse)
    return statisticsResponse.data;
};

// Helper function to fetch data for the bar chart
const fetchBarChartData = async (month) => {
    // Implement logic to fetch bar chart data for the specified month from the barchart endpoint
    // For example:
    const barChartDataResponse = await axios.get(`http://localhost:8000/barChart?month=${month}`);
    return barChartDataResponse.data;
};

// Helper function to fetch data for the pie chart
const fetchPieChartData = async (month) => {
    // Implement logic to fetch pie chart data for the specified month from the piechart endpoint
    // For example:
    const pieChartDataResponse = await axios.get(`http://localhost:8000/pieChart?month=${month}`);
    return pieChartDataResponse.data;
};

// Combine and send the final response
combinedDataRouter.get('/', async (req, res) => {
    try {
        // Fetch the selected month from the request query
        const month = req.query.month;
        console.log('month:', month)

        // Fetch data from all three endpoints asynchronously
        const [statistics, barChartData, pieChartData] = await Promise.all([
            fetchStatistics(month),
            fetchBarChartData(month),
            fetchPieChartData(month)
        ]);

        // Combine the responses into a single object
        const combinedResponse = {
            statistics: statistics,
            barChartData: barChartData,
            pieChartData: pieChartData
        };

        // Send the combined response
        console.log('combinedResponse:', combinedResponse)
        res.json(combinedResponse);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = {
    combinedDataRouter
};



/**
 * @swagger
 * /combined-data:
 *   get:
 *     summary: Fetch combined data
 *     description: Fetches data from multiple endpoints and combines the responses into a single JSON object.
 *     parameters:
 *       - in: query
 *         name: month
 *         description: Month to filter data
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with combined data
 *       '500':
 *         description: Internal server error
 */
