const db = require('../database/db');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has set initial balance
    const [user] = await db.promise().query(
      'SELECT initial_balance_set FROM users WHERE id = ?',
      [userId]
    );

    const initialBalanceRequired = !user[0]?.initial_balance_set;

    // Get summary stats
    const [stats] = await db.promise().query(
      `SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
       FROM transactions 
       WHERE user_id = ?`,
      [userId]
    );

    // Get recent transactions
    const [transactions] = await db.promise().query(
      `SELECT t.*, c.name as category 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = ?
       ORDER BY t.date DESC, t.created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Get spending by category (INCOME + EXPENSE)
    const [categories] = await db.promise().query(
      `SELECT c.name as category, t.type, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ?
       GROUP BY c.name, t.type
       ORDER BY total DESC`,
      [userId]
    );

    // Get monthly trends
    const [monthlyTrends] = await db.promise().query(
      `SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
       FROM transactions
       WHERE user_id = ?
       GROUP BY month
       ORDER BY month DESC
       LIMIT 6`,
      [userId]
    );

    // Calculate savings rate
    const totalIncome = Number(stats[0].totalIncome) || 0;
    const balance = Number(stats[0].balance) || 0;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    res.json({
      initialBalanceRequired,
      stats: {
        totalIncome,
        totalExpense: Number(stats[0].totalExpense) || 0,
        balance,
        savingsRate,
      },
      recentTransactions: transactions,
      spendingByCategory: categories,
      monthlyTrends: monthlyTrends.reverse(),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

const setInitialBalance = async (req, res) => {
  try {
    const { initialBalance } = req.body;
    const userId = req.user.id;

    // 1. Check if "Initial Balance" income category exists for this user
    const [categories] = await db.promise().query(
      `SELECT id FROM categories WHERE user_id = ? AND name = 'Initial Balance' AND type = 'income' LIMIT 1`,
      [userId]
    );

    let categoryId;
    if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      // 2. If not, create it
      const [result] = await db.promise().query(
        `INSERT INTO categories (user_id, name, type) VALUES (?, 'Initial Balance', 'income')`,
        [userId]
      );
      categoryId = result.insertId;
    }

    // 3. Insert the initial balance transaction with the correct category_id
    await db.promise().query(
      `INSERT INTO transactions 
       (user_id, type, amount, date, description, category_id) 
       VALUES (?, 'income', ?, NOW(), 'Initial balance', ?)`,
      [userId, initialBalance, categoryId]
    );

    // Mark user as having set initial balance
    await db.promise().query(
      'UPDATE users SET initial_balance_set = TRUE WHERE id = ?',
      [userId]
    );

    res.json({ success: true, message: 'Initial balance set successfully' });
  } catch (error) {
    console.error('Error setting initial balance:', error);
    res.status(500).json({ message: 'Failed to set initial balance' });
  }
};

module.exports = {
  getDashboardData,
  setInitialBalance
};  