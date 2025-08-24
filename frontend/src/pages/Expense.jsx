import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllTransaction } from '../store/slices/transactionSlice';
import { FiTrendingDown, FiDollarSign, FiCalendar, FiPieChart, FiAlertCircle } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Expense = () => {
  const dispatch = useDispatch();
  const { transactionList } = useSelector((state) => state.transaction);
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    dispatch(getAllTransaction());
  }, [dispatch]);

  // Filter expense transactions
  const expenseTransactions = transactionList.filter(transaction => transaction.type === 'expense');

  // Calculate monthly expense data
  const monthlyExpenseData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);

    expenseTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        monthlyData[month] += parseFloat(transaction.amount);
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: monthlyData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    };
  };

  // Calculate expense by category
  const expenseByCategoryData = () => {
    const categoryTotals = {};
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount);
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(20, 184, 166, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  // Calculate expense trend (last 6 months)
  const expenseTrendData = () => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth()
      });
    }

    const trendData = last6Months.map(monthInfo => {
      return expenseTransactions
        .filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getFullYear() === monthInfo.year && 
                 transactionDate.getMonth() === monthInfo.monthIndex;
        })
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
    });

    return {
      labels: last6Months.map(m => m.month),
      datasets: [
        {
          label: 'Expense Trend',
          data: trendData,
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Calculate statistics
  const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
  const averageExpense = expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0;
  const thisMonthExpenses = expenseTransactions
    .filter(transaction => {
      const date = new Date(transaction.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  // Find highest expense category
  const categoryTotals = {};
  expenseTransactions.forEach(transaction => {
    const category = transaction.category || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount);
  });
  const highestCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b, 'None'
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      {/* Header with time range selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Expense Analysis</h2>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          {['weekly', 'monthly', 'yearly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <FiDollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">This Month</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">${thisMonthExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <FiCalendar className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Average Expense</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">${averageExpense.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <FiTrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Top Category</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{highestCategory}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expense Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100 mb-4">Monthly Expenses ({new Date().getFullYear()})</h3>
          <div className="h-80">
            <Bar data={monthlyExpenseData()} options={chartOptions} />
          </div>
        </div>

        {/* Expense by Category */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100 mb-4">Expenses by Category</h3>
          <div className="h-80 flex items-center justify-center">
            {Object.keys(expenseByCategoryData().labels).length > 0 ? (
              <div className="w-full max-w-sm">
                <Doughnut data={expenseByCategoryData()} options={pieOptions} />
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-slate-500">
                <FiPieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Trend */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100 mb-4">Expense Trend (Last 6 Months)</h3>
        <div className="h-80">
          <Line data={expenseTrendData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Expense;
