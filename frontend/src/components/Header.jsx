import React from 'react';
import { FiPlus, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ activeTab, setShowAddModal }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  let title = '';
  switch (activeTab) {
    case 'overview':
      title = 'Dashboard Overview';
      break;
    case 'transactions':
      title = 'All Transactions';
      break;
    case 'income':
      title = 'Income Tracking';
      break;
    case 'expense':
      title = 'Expense Tracking';
      break;
    case 'reports':
      title = 'Financial Reports';
      break;
    case 'settings':
      title = 'Settings';
      break;
    default:
      title = '';
  }
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center justify-between p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{title}</h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              console.log('Theme toggle clicked, current isDarkMode:', isDarkMode);
              toggleTheme();
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors shadow-sm"
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {/* Add Transaction Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-3 md:px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            <FiPlus className="mr-1 md:mr-2 w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm md:text-base">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;