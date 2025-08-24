/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import image1 from "../assets/finance.svg"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { error, loading, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    console.log(data);
    dispatch(login(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigate("/");
      console.log(isAuthenticated);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 md:p-10 transition-all duration-300 hover:shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Sign in to continue to ExpenseTracker
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all pr-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-100 via-white to-green-50 items-center justify-center p-10">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <img
            src={image1}
            alt="Track your spending"
            className="w-72 mx-auto"
          />
          <h2 className="text-3xl font-bold text-gray-800 leading-snug">
            Smarter Expense
            <br /> Tracking Starts Here
          </h2>
          <p className="text-gray-600 text-base">
            Visualize your budget, control your spendings, and achieve your financial
            goals faster with our user-friendly dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;