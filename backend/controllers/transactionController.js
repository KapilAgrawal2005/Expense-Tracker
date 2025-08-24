const db = require("../database/db");

const getAllTransactions = async (req, res) => {
  try {
    const [transactions] = await db.promise().query(
      `SELECT t.*, c.name as category 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = ?
       ORDER BY t.date DESC, t.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

const getTransactionById = (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  const query = `
    SELECT t.*, c.name AS category_name
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.id = ?
    LIMIT 1
  `;

  db.query(query, [userId, transactionId], (err, results) => {
    if (err) {
      console.error("Error fetching transaction:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(results[0]);
  });
};

const createTransaction = async (req, res) => {
  // Ensure the request is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Validate request body
  const { type, category, amount, date, description } = req.body;


  if (!type || !["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type" });
  }

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: "Valid date is required" });
  }

  try {
    // Start transaction
    await db.promise().query("START TRANSACTION");

    // 1. Find or create category
    const [categoryRows] = await db
      .promise()
      .query(
        "SELECT id FROM categories WHERE name = ? AND user_id = ? AND type = ?",
        [category, req.user.id, type]
      );

    let categoryId;
    if (categoryRows.length > 0) {
      categoryId = categoryRows[0].id;
    } else {
      // Create new category if it doesn't exist
      const [insertResult] = await db
        .promise()
        .query(
          "INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)",
          [category, type, req.user.id]
        );
      categoryId = insertResult.insertId;
    }

    // 2. Create transaction
    const [transactionResult] = await db.promise().query(
      `INSERT INTO transactions 
       (user_id,type, category_id, amount, date, description) 
       VALUES (?,?,?, ?, ?, ?)`,
      [req.user.id, type, categoryId, amount, date, description || null]
    );

    // 3. Get the full transaction details with category name
    const [newTransaction] = await db.promise().query(
      `SELECT t.*, c.name AS category 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.id = ?`,
      [transactionResult.insertId]
    );

    await db.promise().query("COMMIT");
    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: newTransaction[0],
    });
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("Transaction creation error:", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const [result] = await db
      .promise()
      .query("DELETE FROM transactions WHERE id = ? AND user_id = ?", [
        req.params.id,
        req.user.id,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;

  // Validation (same as createTransaction)

  try {
    await db.promise().query("START TRANSACTION");

    // Find or create category
    const [categoryRows] = await db
      .promise()
      .query(
        "SELECT id FROM categories WHERE name = ? AND user_id = ? AND type = ?",
        [category, req.user.id, type]
      );

    let categoryId;
    if (categoryRows.length > 0) {
      categoryId = categoryRows[0].id;
    } else {
      const [insertResult] = await db
        .promise()
        .query(
          "INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)",
          [category, type, req.user.id]
        );
      categoryId = insertResult.insertId;
    }

    // Update transaction
    await db.promise().query(
      `UPDATE transactions SET
       type = ?, category_id = ?, amount = ?, date = ?, description = ?
       WHERE id = ? AND user_id = ?`,
      [type, categoryId, amount, date, description || null, id, req.user.id]
    );

    // Get updated transaction
    const [updatedTransaction] = await db.promise().query(
      `SELECT t.*, c.name as category 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.id = ?`,
      [id]
    );

    await db.promise().query("COMMIT");
    res.json(updatedTransaction[0]);
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

const getReportsData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = 'monthly' } = req.query;

    // Get current year for monthly data
    const currentYear = new Date().getFullYear();

    // Monthly spending data for the current year
    const [monthlySpending] = await db.promise().query(
      `SELECT
        MONTH(date) as month,
        MONTHNAME(date) as monthName,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as spending,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income
       FROM transactions
       WHERE user_id = ? AND YEAR(date) = ?
       GROUP BY MONTH(date), MONTHNAME(date)
       ORDER BY MONTH(date)`,
      [userId, currentYear]
    );

    // Category breakdown for expenses
    const [categoryBreakdown] = await db.promise().query(
      `SELECT c.name as category, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND t.type = 'expense'
       GROUP BY c.name
       ORDER BY total DESC`,
      [userId]
    );

    // Income vs Expenses for last 6 months
    const [comparisonData] = await db.promise().query(
      `SELECT
        DATE_FORMAT(date, '%Y-%m') as month,
        MONTHNAME(date) as monthName,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
       FROM transactions
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(date, '%Y-%m'), MONTHNAME(date)
       ORDER BY month DESC
       LIMIT 6`,
      [userId]
    );

    // Calculate summary statistics
    const [summaryStats] = await db.promise().query(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpenses,
        (SELECT c.name FROM transactions t JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ? AND t.type = 'expense'
         GROUP BY c.name ORDER BY SUM(t.amount) DESC LIMIT 1) as largestExpenseCategory,
        (SELECT SUM(amount) FROM transactions t JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ? AND t.type = 'expense'
         GROUP BY c.name ORDER BY SUM(t.amount) DESC LIMIT 1) as largestExpenseAmount
       FROM transactions
       WHERE user_id = ?`,
      [userId, userId, userId]
    );

    // Calculate savings rate
    const totalIncome = Number(summaryStats[0].totalIncome) || 0;
    const totalExpenses = Number(summaryStats[0].totalExpenses) || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Format monthly spending data to include all 12 months
    const monthlySpendingFormatted = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 1; i <= 12; i++) {
      const monthData = monthlySpending.find(m => m.month === i);
      monthlySpendingFormatted.push({
        month: monthNames[i - 1],
        spending: monthData ? Number(monthData.spending) : 0,
        income: monthData ? Number(monthData.income) : 0
      });
    }

    res.json({
      success: true,
      data: {
        monthlySpending: monthlySpendingFormatted,
        categoryBreakdown: categoryBreakdown.map(cat => ({
          category: cat.category,
          total: Number(cat.total)
        })),
        comparisonData: comparisonData.reverse().map(comp => ({
          month: comp.monthName,
          income: Number(comp.income),
          expenses: Number(comp.expenses)
        })),
        summaryStats: {
          totalIncome,
          totalExpenses,
          savingsRate: Math.round(savingsRate),
          largestExpenseCategory: summaryStats[0].largestExpenseCategory || 'N/A',
          largestExpenseAmount: Number(summaryStats[0].largestExpenseAmount) || 0
        }
      }
    });

  } catch (error) {
    console.error("Error fetching reports data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports data",
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getReportsData,
};
