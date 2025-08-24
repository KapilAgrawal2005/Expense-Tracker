import React, { useEffect, useState } from "react";
import { signup, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import image1 from "../assets/accountant.svg"

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const dispatch = useDispatch();
  const { error, loading, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSignUp = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    dispatch(signup(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigateTo("/");
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
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
                <FiLock className="h-5 w-5" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Join{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ExpenseTracker
              </span>
            </h1>
            <p className="text-gray-500">
              Start managing your finances like a pro
            </p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
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
                  minLength="6"
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
                  Creating Account...
                </>
              ) : (
                <>
                  Get Started <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              Sign In
            </a>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
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
          <div className="flex justify-center gap-4 pt-2">
            <div className="bg-white shadow-md rounded-xl px-4 py-2 text-sm font-medium text-green-600 border border-green-200">
              💡 Real-Time Insights
            </div>
            <div className="bg-white shadow-md rounded-xl px-4 py-2 text-sm font-medium text-green-600 border border-green-200">
              🔒 100% Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;