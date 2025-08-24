import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiPlus } from 'react-icons/fi';
import {
  getAllTransaction,
  resetTransactionSlice,
  deleteTransaction,
} from "../store/slices/transactionSlice";
import AddTransactionModal from "../components/AddTransactionModal";
import ConfirmDialog from "../components/ConfirmDialog";
import TransactionsTable from "../components/TransactionsTable";

const Transactions = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { error, message, transactionList } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(getAllTransaction());
  }, [dispatch]);

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

  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTransaction(selectedId));
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowAddModal(true);
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Apply sorting to transactions
  const sortedTransactions = [...transactionList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Calculate pagination
  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
        >
          <FiPlus className="mr-2" />
          Add Transaction
        </button>
      </div>

      <TransactionsTable
        transactions={paginatedTransactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortConfig={sortConfig}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Modals */}
      {showAddModal && (
        <AddTransactionModal
          key={Date.now()}
          setShowAddModal={setShowAddModal}
          editingTransaction={editingTransaction}
        />
      )}

      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Transactions;