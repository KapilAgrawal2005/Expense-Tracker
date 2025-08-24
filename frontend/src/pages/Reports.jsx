import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getReportsData, resetReportsState } from '../store/slices/reportsSlice';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.reports);

  // Fetch reports data
  useEffect(() => {
    dispatch(getReportsData(timeRange));
  }, [dispatch, timeRange]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetReportsState());
    }
  }, [error, dispatch]);

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    dispatch(getReportsData(newTimeRange));
  };

  // Prepare chart data from Redux store
  const monthlySpendingData = {
    labels: data.monthlySpending.map(item => item.month),
    datasets: [
      {
        label: 'Spending',
        data: data.monthlySpending.map(item => item.spending),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  // Income vs Expenses data
  const comparisonData = {
    labels: data.comparisonData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: data.comparisonData.map(item => item.income),
        backgroundColor: 'rgba(74, 222, 128, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: data.comparisonData.map(item => item.expenses),
        backgroundColor: 'rgba(248, 113, 113, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  // Category breakdown data
  const categoryData = {
    labels: data.categoryBreakdown.map(item => item.category),
    datasets: [
      {
        label: 'Spending',
        data: data.categoryBreakdown.map(item => item.total),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(244, 114, 182, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Calculate totals for display
  const totalMonthlySpending = data.monthlySpending.reduce((sum, item) => sum + item.spending, 0);
  const totalCategorySpending = data.categoryBreakdown.reduce((sum, item) => sum + item.total, 0);

  const options = {
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
            return `${label}: $${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-full"></div>
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header with title and time range selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm">
          {['weekly', 'monthly', 'yearly'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Spending Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h3 className="font-semibold text-lg text-gray-800">Monthly Spending</h3>
          <div className="text-sm text-gray-500">
            Total: <span className="font-medium text-gray-800">${totalMonthlySpending.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-80">
          <Bar
            data={monthlySpendingData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  display: true,
                  text: `Monthly Spending (${new Date().getFullYear()})`,
                  font: { size: 16 },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Income vs Expenses and Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h3 className="font-semibold text-lg text-gray-800">Income vs Expenses</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <Bar
              data={comparisonData}
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    display: true,
                    text: 'Last 6 Months Comparison',
                    font: { size: 16 },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h3 className="font-semibold text-lg text-gray-800">Category Breakdown</h3>
            <div className="text-sm text-gray-500">
              Total: <span className="font-medium text-gray-800">${totalCategorySpending.toLocaleString()}</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <Doughnut
                data={categoryData}
                options={pieOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={`$${data.summaryStats.totalIncome.toLocaleString()}`}
          change="YTD"
          isPositive={true}
          icon={
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Total Expenses"
          value={`$${data.summaryStats.totalExpenses.toLocaleString()}`}
          change="YTD"
          isPositive={false}
          icon={
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          }
        />
        <StatCard
          title="Savings Rate"
          value={`${data.summaryStats.savingsRate}%`}
          change="Overall"
          isPositive={data.summaryStats.savingsRate > 0}
          icon={
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Largest Expense"
          value={data.summaryStats.largestExpenseCategory}
          change={`$${data.summaryStats.largestExpenseAmount.toLocaleString()}`}
          isPositive={false}
          icon={
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-opacity-20 bg-gray-100">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`inline-flex items-center text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
          {isPositive ? (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last period</span>
      </div>
    </div>
  );
};

export default Reports;