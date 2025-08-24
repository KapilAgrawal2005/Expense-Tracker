import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const PieChart = ({ data }) => {
  // Handle empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400 dark:text-slate-500">
          <div className="text-4xl mb-2">🥧</div>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.category || 'Unknown'),
    datasets: [
      {
        data: data.map(item => Number(item.total) || 0),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
          '#FF9F80', '#C9CBCF', '#4BC0C0', '#FFCD56'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
          '#FF9F80', '#C9CBCF', '#4BC0C0', '#FFCD56'
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
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
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: $${Number(value).toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export const BarChart = ({ data }) => {
  // Handle both array format and Chart.js data object format
  let chartData;

  if (!data) {
    // No data provided
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400 dark:text-slate-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  if (Array.isArray(data)) {
    // Old format: array of objects with month, income, expense properties
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400 dark:text-slate-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available</p>
          </div>
        </div>
      );
    }

    chartData = {
      labels: data.map(item => item.month || 'Unknown'),
      datasets: [
        {
          label: 'Income',
          data: data.map(item => Number(item.income) || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Expenses',
          data: data.map(item => Number(item.expense) || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 6,
        }
      ]
    };
  } else if (data.labels && data.datasets) {
    // New format: Chart.js data object
    chartData = data;
  } else {
    // Invalid format
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400 dark:text-slate-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Invalid data format</p>
        </div>
      </div>
    );
  }

  const options = {
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
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: $${Number(value).toLocaleString()}`;
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
            return '$' + Number(value).toLocaleString();
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
  };

  return <Bar data={chartData} options={options} />;
};