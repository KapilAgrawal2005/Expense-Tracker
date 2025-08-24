import React, { useState } from 'react';
import { 
  FiEdit, FiTrash2, FiTrendingUp, FiTrendingDown,
  FiFilter, FiChevronUp, FiChevronDown, FiChevronsLeft,
  FiChevronLeft, FiChevronRight, FiChevronsRight
} from 'react-icons/fi';
import { 
  FaUtensils, FaCar, FaHome, FaFilm, 
  FaBriefcaseMedical, FaGraduationCap, FaShoppingBag, FaGift,
  FaMoneyBillWave
} from 'react-icons/fa';
import { BsGraphUp, BsCreditCard } from 'react-icons/bs';

const TransactionsTable = ({ 
  transactions, 
  onEdit, 
  onDelete,
  onSort,
  sortConfig,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Get unique categories for filter dropdown
  const categories = [...new Set(transactions.map(t => t.category))];

  const getCategoryIcon = (category, type = 'expense') => {
    const iconSize = "text-lg";
    
    if (type === 'income') {
      switch(category) {
        case 'Salary': return <FaBriefcaseMedical className={`${iconSize} text-blue-500`} />;
        case 'Freelance': return <BsGraphUp className={`${iconSize} text-purple-500`} />;
        case 'Investment': return <FaMoneyBillWave className={`${iconSize} text-green-500`} />;
        case 'Gift': return <FaGift className={`${iconSize} text-pink-500`} />;
        default: return <BsCreditCard className={`${iconSize} text-indigo-500`} />;
      }
    } else {
      switch(category) {
        case 'Food': return <FaUtensils className={`${iconSize} text-red-500`} />;
        case 'Transportation': return <FaCar className={`${iconSize} text-yellow-500`} />;
        case 'Housing': return <FaHome className={`${iconSize} text-amber-500`} />;
        case 'Entertainment': return <FaFilm className={`${iconSize} text-purple-500`} />;
        case 'Healthcare': return <FaBriefcaseMedical className={`${iconSize} text-blue-500`} />;
        case 'Education': return <FaGraduationCap className={`${iconSize} text-indigo-500`} />;
        case 'Shopping': return <FaShoppingBag className={`${iconSize} text-pink-500`} />;
        default: return <FaMoneyBillWave className={`${iconSize} text-gray-500`} />;
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by search term
    const matchesSearch = 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type
    const matchesType = 
      filterType === "all" || 
      transaction.type === filterType;
    
    // Filter by category
    const matchesCategory = 
      filterCategory === "all" || 
      transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' 
      ? <FiChevronUp className="ml-1 inline" /> 
      : <FiChevronDown className="ml-1 inline" />;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    onSort(key, direction);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 w-full py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              className="pl-10 w-full py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <select
              className="pl-10 w-full py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              className="w-full py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={20}>Show 20</option>
              <option value={50}>Show 50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description
                  {getSortIcon('description')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {getSortIcon('amount')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(transaction.category, transaction.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.category}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {transaction.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={transaction.description}>
                        {transaction.description || '--'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formattedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="inline-flex items-center">
                          {transaction.type === 'income' ? (
                            <FiTrendingUp className="mr-1" />
                          ) : (
                            <FiTrendingDown className="mr-1" />
                          )}
                          {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        aria-label="Edit"
                      >
                        <FiEdit className="inline" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete"
                      >
                        <FiTrash2 className="inline" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * pageSize, filteredTransactions.length)}</span> of{' '}
              <span className="font-medium">{filteredTransactions.length}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onPageChange(1)} 
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronsLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onPageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => onPageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onPageChange(totalPages)} 
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;