const express = require('express');
const router = express.Router();
const {getAllUsers, loginUser, createUser,logOut} = require('../controllers/userController');
const isAuthenticated = require("../middleware/authMiddleware");
router.get('/', getAllUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout',isAuthenticated, logOut);

module.exports = router;
