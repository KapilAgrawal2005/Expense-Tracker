import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialBalance } from '../store/slices/dashboardSlice';
import { toast } from 'react-toastify';
import { FiDollarSign } from 'react-icons/fi';

const InitialBalanceForm = () => {
  const [balance, setBalance] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!balance || isNaN(balance)) {
      toast.error('Please enter a valid amount');
      return;
    }
    dispatch(setInitialBalance(parseFloat(balance)));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
              <FiDollarSign className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ExpenseTracker</h1>
          <p className="text-gray-600">Let's get started by setting your initial balance</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Balance
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-3 border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <span className="text-gray-500 sm:text-sm pr-3">USD</span>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Set Initial Balance
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialBalanceForm;