const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Added for token generation

// Get all users
const getAllUsers = (req, res) => {
  db.query('SELECT id, username, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Create user (Sign Up)
const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password.length < 6 || password.length > 12) {
    return res.status(400).json({ error: 'Password must be between 7 and 12 characters long.' });
  }

  try {
    // Check if username or email already exists
    const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkSql, [username, email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into DB
      const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'User created', userId: result.insertId });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 3*3600000, sameSite: 'lax', secure:false}); 

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, username: user.username, email: user.email } 
    });
  });
};

const logOut=async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: `Logout error ${error}` });
    }
}

module.exports = { loginUser, createUser, getAllUsers, logOut };