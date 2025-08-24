import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData, setInitialBalance } from '../store/slices/dashboardSlice';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { PieChart, BarChart } from '../components/FinancialChart';
import TransactionsTable from '../components/TransactionsTable';
import InitialBalanceForm from '../components/InitialBalanceForm';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    data, 
    loading, 
    error, 
    message,
    initialBalanceRequired 
  } = useSelector((state) => state.dashboard);

  // All hooks must be called unconditionally, at the top
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (message) toast.success(message);
    if (error) toast.error(error);
  }, [message, error]);

  // Early returns are fine, but hooks must be above this
  if (initialBalanceRequired) {
    return <InitialBalanceForm />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { stats, recentTransactions, spendingByCategory, monthlyTrends } = data;

  // Convert stats fields to numbers to avoid .toFixed error
  const balance = Number(stats.balance) || 0;
  const totalIncome = Number(stats.totalIncome) || 0;
  const totalExpense = Number(stats.totalExpense) || 0;
  const savingsRate = Number(stats.savingsRate) || 0;

  // Prepare PieChart data to show both income and expense by category
  const pieChartData = (spendingByCategory || [])
    .filter(item => item.category && item.type && item.total)
    .map(item => ({
      name: `${item.category} (${item.type})`,
      value: Number(item.total),
      fill: item.type === 'income' ? '#34d399' : '#f87171',
    }));

  // Pagination logic
  const pageSize = 5;
  const totalPages = Math.ceil(recentTransactions.length / pageSize);
  const paginatedTransactions = recentTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    // You can implement sorting logic here if needed
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 pb-20 lg:pb-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Balance</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-slate-100">${balance.toFixed(2)}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiDollarSign className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Income</p>
              <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiArrowUp className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Expenses</p>
              <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">${totalExpense.toFixed(2)}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <FiArrowDown className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Savings Rate</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">{savingsRate.toFixed(1)}%</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FiPieChart className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100">Yearly Comparison</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-slate-300">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-slate-300">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            {monthlyTrends && monthlyTrends.length > 0 ? (
              <BarChart
                data={{
                  labels: monthlyTrends.map(trend => {
                    const date = new Date(trend.month + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }),
                  datasets: [
                    {
                      label: 'Income',
                      data: monthlyTrends.map(trend => Number(trend.income) || 0),
                      backgroundColor: 'rgba(34, 197, 94, 0.8)',
                      borderColor: 'rgba(34, 197, 94, 1)',
                      borderWidth: 2,
                      borderRadius: 6,
                      borderSkipped: false,
                    },
                    {
                      label: 'Expenses',
                      data: monthlyTrends.map(trend => Number(trend.expense) || 0),
                      backgroundColor: 'rgba(239, 68, 68, 0.8)',
                      borderColor: 'rgba(239, 68, 68, 1)',
                      borderWidth: 2,
                      borderRadius: 6,
                      borderSkipped: false,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12,
                          weight: '500'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      cornerRadius: 8,
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      },
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        },
                        font: {
                          size: 11
                        }
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400 dark:text-slate-500">
                  <FiPieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data available for yearly comparison</p>
                  <p className="text-sm">Add some transactions to see your financial trends</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-slate-100">Monthly Trend</h3>
          <div className="h-80">
            <BarChart data={monthlyTrends} />
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 dark:border-slate-700">
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100">Recent Transactions</h3>
          <a href="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </a>
        </div>
        <TransactionsTable
          transactions={paginatedTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
          onSort={handleSort}
          sortConfig={sortConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );
};

export default Dashboard;