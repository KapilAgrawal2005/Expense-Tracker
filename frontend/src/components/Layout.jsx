import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AddTransactionModal from './AddTransactionModal';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetAuthSlice } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiPieChart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Update activeTab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('overview');
    } else if (path === '/transactions') {
      setActiveTab('transactions');
    } else if (path === '/income') {
      setActiveTab('income');
    } else if (path === '/expense') {
      setActiveTab('expense');
    } else if (path === '/reports') {
      setActiveTab('reports');
    } else if (path === '/settings') {
      setActiveTab('settings');
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      // Clear any additional local storage
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, but clearing session");
      // Force navigation even if logout fails
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  // Check authentication status
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  // if(!isAuthenticated){
  //   return navigate("/login")
  // }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <Sidebar handleLogout={handleLogout} activeTab={activeTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full lg:w-auto">
        <Header activeTab={activeTab} setShowAddModal={setShowAddModal} />
        <main className="p-3 md:p-6 mobile-padding">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
        {showAddModal && (
          <AddTransactionModal setShowAddModal={setShowAddModal}/>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 z-20 shadow-lg">
        <div className="flex justify-around py-2 px-2">
          {[
            { path: '/', icon: 'overview', label: 'Home', IconComponent: FiPieChart },
            { path: '/transactions', icon: 'transactions', label: 'Transactions', IconComponent: FaMoneyBillWave },
            { path: '/income', icon: 'income', label: 'Income', IconComponent: FiTrendingUp },
            { path: '/expense', icon: 'expense', label: 'Expense', IconComponent: FiTrendingDown },
            { path: '/reports', icon: 'reports', label: 'Reports', IconComponent: BsGraphUp }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                activeTab === item.icon
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transform scale-110'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className={`p-1 rounded-lg mb-1 ${
                activeTab === item.icon
                  ? 'bg-blue-200 dark:bg-blue-800/50'
                  : 'bg-transparent'
              }`}>
                <item.IconComponent className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;