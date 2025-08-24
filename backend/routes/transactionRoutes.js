const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getReportsData,
} = require("../controllers/transactionController");
const isAuthenticated = require("../middleware/authMiddleware");

router.get("/all", isAuthenticated, getAllTransactions);
router.get("/reports", isAuthenticated, getReportsData);
router.get("/:id", isAuthenticated, getTransactionById);
router.post("/create",isAuthenticated, createTransaction)
router.put("/edit/:id",isAuthenticated, updateTransaction)
router.delete("/delete/:id",isAuthenticated, deleteTransaction)
module.exports = router;