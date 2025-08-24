import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTransaction,
  updateTransaction,
  resetTransactionSlice,
} from "../store/slices/transactionSlice";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const AddTransactionModal = ({ setShowAddModal, editingTransaction }) => {
  const [type, setType] = useState(editingTransaction?.type || "income");
  const [category, setCategory] = useState(editingTransaction?.category || "");
  const [amount, setAmount] = useState(editingTransaction?.amount || "");
  const [date, setDate] = useState(
    editingTransaction?.date || new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(
    editingTransaction?.description || ""
  );

  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.transaction);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setAmount(editingTransaction.amount);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      type,
      category,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      description,
    };

    console.log('Submitting transaction:', data);
        console.log(editingTransaction);


    try {
    if (editingTransaction) {
      dispatch(updateTransaction({ 
        id: editingTransaction.id,
        ...data,        
      }))
    } else {
      dispatch(createTransaction(data))
    }
    
    setShowAddModal(false);
  } catch (error) {
    console.error('Transaction submission error:', error);
  }
};
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetTransactionSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetTransactionSlice());
    }
  }, [dispatch, error, message]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
            {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setType("income")}
                className={`px-4 py-2 rounded-lg flex-1 transition-colors ${
                  type === "income"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-600"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`px-4 py-2 rounded-lg flex-1 transition-colors ${
                  type === "expense"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-600"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600"
                }`}
              >
                Expense
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
              required
            >
              <option value="">Select a category</option>
              {type === "income" ? (
                <>
                  <option value="Salary">💼 Salary</option>
                  <option value="Freelance">💻 Freelance</option>
                  <option value="Business">🏢 Business</option>
                  <option value="Investment">📈 Investment</option>
                  <option value="Rental">🏠 Rental Income</option>
                  <option value="Dividend">💰 Dividend</option>
                  <option value="Interest">🏦 Interest</option>
                  <option value="Bonus">🎁 Bonus</option>
                  <option value="Commission">💸 Commission</option>
                  <option value="Gift">🎉 Gift</option>
                  <option value="Refund">↩️ Refund</option>
                  <option value="Side Hustle">🚀 Side Hustle</option>
                  <option value="Pension">👴 Pension</option>
                  <option value="Other">📋 Other</option>
                </>
              ) : (
                <>
                  <option value="Food & Dining">🍽️ Food & Dining</option>
                  <option value="Groceries">🛒 Groceries</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Gas & Fuel">⛽ Gas & Fuel</option>
                  <option value="Housing">🏠 Housing</option>
                  <option value="Utilities">💡 Utilities</option>
                  <option value="Internet & Phone">📱 Internet & Phone</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Healthcare">🏥 Healthcare</option>
                  <option value="Education">📚 Education</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Clothing">👕 Clothing</option>
                  <option value="Personal Care">💄 Personal Care</option>
                  <option value="Fitness">💪 Fitness</option>
                  <option value="Travel">✈️ Travel</option>
                  <option value="Insurance">🛡️ Insurance</option>
                  <option value="Taxes">📊 Taxes</option>
                  <option value="Subscriptions">📺 Subscriptions</option>
                  <option value="Gifts & Donations">🎁 Gifts & Donations</option>
                  <option value="Pet Care">🐕 Pet Care</option>
                  <option value="Home Improvement">🔨 Home Improvement</option>
                  <option value="Bank Fees">🏦 Bank Fees</option>
                  <option value="Other">📋 Other</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
              placeholder="Short description"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              {editingTransaction ? "Update Transaction" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
