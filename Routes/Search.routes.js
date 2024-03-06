const express = require("express");
const { TransactionModel } = require("../Models/Transaction");

const searchRouter = express.Router();

// Handler function to search transactions
const searchTransactions = async (searchText, res, page, perPage) => {
  try {
    const encodedSearchText = encodeURIComponent(searchText);
    console.log("encodedSearchText:", encodedSearchText);

    let query = {};

    // Check if the searchText is a number
    const isNumeric = !isNaN(parseFloat(searchText));

    if (isNumeric) {
      // Numeric search for price (approximate)
      query = {
        price: {
          $gte: parseFloat(searchText) - 1,
          $lte: parseFloat(searchText) + 1,
        },
      };
    } else {
      // String search for title or description
      query = {
        $or: [
          {
            title: {
              $regex: decodeURIComponent(encodedSearchText),
              $options: "i",
            },
          },
          {
            description: {
              $regex: decodeURIComponent(encodedSearchText),
              $options: "i",
            },
          },
        ],
      };
    }

    // Fetch all transactions matching the query
    const transactions = await TransactionModel.find(query);
    console.log("transactionsFunc:", transactions);

    // Calculate total pages based on total count and perPage
    const totalPages = Math.ceil(transactions.length / perPage);

    // Paginate the results
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    // Send response with paginated transactions and total pages
    res.json({ transactions: paginatedTransactions, totalPages: totalPages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// API to list all transactions with search
searchRouter.get("/", async (req, res) => {
  try {
    const searchText = req.query.search || "";

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const delay = 300; // Adjust the debounce delay as needed

    // Execute the search only if there are search words
    if (searchText.length > 0) {
      // Debounce the search function
      setTimeout(() => {
        searchTransactions(searchText, res, page, perPage);
      }, delay);
    } else {
      // If search parameter is empty, return all records with pagination
      const transactions = await TransactionModel.find().maxTimeMS(30000);

      // Calculate total pages based on total count and perPage
      const totalPages = Math.ceil(transactions.length / perPage);

      // Paginate the results
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      const paginatedTransactions = transactions.slice(startIndex, endIndex);

      // Send response with paginated transactions and total pages
      res.json({ transactions: paginatedTransactions, totalPages: totalPages });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

searchRouter.get("/search_month", async (req, res) => {
  try {
    const { month, page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    let query = {};

    
    // If month parameter is provided and not empty, filter transactions by month
    if (month && month.trim() !== "") {
      query = { month };
    }

    // Query transactions for the specified month
    const transactions = await TransactionModel.find(query)
      .skip(skip)
      .limit(perPage);

    // // Query total count of transactions for pagination
    // const totalCount = await TransactionModel.countDocuments({ month });

    // Query total count of transactions for pagination
    const totalCountQuery = month && month.trim() !== "" ? { month } : {};
    const totalCount = await TransactionModel.countDocuments(totalCountQuery);

    // Calculate total pages based on total count and perPage
    const totalPages = Math.ceil(totalCount / perPage);

    res.json({
      transactions: transactions,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  searchRouter,
};

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search transactions
 *     description: Returns a list of transactions matching the search criteria
 *     parameters:
 *       - in: query
 *         name: search
 *         description: Search text for title or description, or numeric value for approximate price search
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './Models/Transaction'
 *       500:
 *         description: Internal server error
 */
