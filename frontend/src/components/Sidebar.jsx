import React from 'react';
import { Link } from 'react-router-dom';
import { FiPieChart, FiSettings, FiLogOut, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';

const Sidebar = ({ activeTab, handleLogout }) => {
  return (
    <div className="w-64 bg-white dark:bg-slate-800 shadow-lg relative border-r border-gray-200 dark:border-slate-700 transition-all duration-300 h-full flex flex-col min-h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">ExpenseTrack</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">Financial Management</p>
          </div>
        </div>
      </div>
      {/* Navigation Section */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>

          <Link to="/">
            <div
              className={`group flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-100 hover:transform hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'overview'
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
              }`}>
                <FiPieChart className={`w-5 h-5 ${activeTab === 'overview' ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
              </div>
              <span className="font-medium">Overview</span>
            </div>
          </Link>

          <Link to="/transactions">
            <div
              className={`group flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                activeTab === 'transactions'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-100 hover:transform hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'transactions'
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
              }`}>
                <FaMoneyBillWave className={`w-5 h-5 ${activeTab === 'transactions' ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
              </div>
              <span className="font-medium">Transactions</span>
            </div>
          </Link>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3">
            Analytics
          </p>

          <Link to="/income">
            <div
              className={`group flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                activeTab === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-100 hover:transform hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'income'
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
              }`}>
                <FiTrendingUp className={`w-5 h-5 ${activeTab === 'income' ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
              </div>
              <span className="font-medium">Income</span>
            </div>
          </Link>

          <Link to="/expense">
            <div
              className={`group flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                activeTab === 'expense'
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-100 hover:transform hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'expense'
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
              }`}>
                <FiTrendingDown className={`w-5 h-5 ${activeTab === 'expense' ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
              </div>
              <span className="font-medium">Expense</span>
            </div>
          </Link>

          <Link to="/reports">
            <div
              className={`group flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                activeTab === 'reports'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-100 hover:transform hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'reports'
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
              }`}>
                <BsGraphUp className={`w-5 h-5 ${activeTab === 'reports' ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
              </div>
              <span className="font-medium">Reports</span>
            </div>
          </Link>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3">
            System
          </p>

          <Link to="/settings">
            <div
              className={`group flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-100 hover:transform hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'settings'
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
              }`}>
                <FiSettings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
              </div>
              <span className="font-medium">Settings</span>
            </div>
          </Link>
        </div>
        
      </nav>
      {/* Logout Section */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-4 py-3 text-left text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
        >
          <div className="p-2 rounded-lg mr-3 bg-gray-100 dark:bg-slate-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30">
            <FiLogOut className="w-5 h-5" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;