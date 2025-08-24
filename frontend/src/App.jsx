import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
    <Routes>
      {/* <Route path='/dashboard' element={<Dashboard/>} /> */}
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/login' element={<Login/>} />
      <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="income" element={<Income />} />
          <Route path="expense" element={<Expense />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
    </Routes>
    <ToastContainer />
    </Router>
  )
}

export default App
