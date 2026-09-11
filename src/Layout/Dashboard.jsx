import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiPlusCircle,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheckSquare,
  FiUsers,
  FiArrowLeft,
  FiPieChart,
  FiUserCheck,
  FiFileText,
  FiCreditCard,
  FiCornerUpLeft,
  FiMail,
  FiAward,
  FiPercent
} from 'react-icons/fi';
import { FaBangladeshiTakaSign } from "react-icons/fa6";

import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useRole from '../hooks/useRole';
import useDbUser from '../hooks/useDbUser';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dbUser] = useDbUser();
  const [cart] = useCart();
  const [role, isRoleLoading] = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout()
      .then(() => {
        queryClient.clear();
        navigate('/login', { replace: true });
        toast.success("Logged out successfully");
      })
      .catch(err => toast.error(err?.message || "Logout failed"));
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
      ? 'bg-[#07A698] text-white shadow-xs font-bold'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
    }`;

  if (isRoleLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center font-sans">
        <div className="h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans">
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-white border-r border-stone-200/80
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#162726]">
                Ed<span className="text-[#07A698]">Care</span>
              </span>
              <span className="text-[10px] bg-[#07A698]/10 text-[#07A698] font-bold px-2 py-0.5 rounded-full uppercase">
                Panel
              </span>
            </Link>
            <button
              onClick={closeSidebar}
              className="lg:hidden text-stone-500 hover:text-stone-800 p-1 rounded-lg cursor-pointer"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-100 rounded-xl">
            <img
              src={dbUser?.photoURL || dbUser?.image || user?.photoURL || "https://i.ibb.co/mJRk027/default-avatar.png"}
              alt={dbUser?.name || user?.displayName || "User"}
              className="w-10 h-10 rounded-full object-cover border border-[#07A698]"
            />
            <div className="overflow-hidden min-w-0">
              <h4 className="text-sm font-bold text-stone-800 truncate">
                {dbUser?.name || user?.displayName || "User"}
              </h4>
              <p className="text-[11px] font-semibold text-[#07A698] capitalize truncate">
                {`${role || 'student'} Account`}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Menu
            </div>

            <NavLink to="/dashboard" end onClick={closeSidebar} className={navLinkStyle}>
              <FiPieChart className="w-5 h-5 shrink-0" />
              <span>Overview</span>
            </NavLink>

            {role === 'teacher' && (
              <>
                <div className="pt-2 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Instructor Studio
                </div>
                <NavLink to="/dashboard/add-class" onClick={closeSidebar} className={navLinkStyle}>
                  <FiPlusCircle className="w-5 h-5 shrink-0" />
                  <span>Add New Course</span>
                </NavLink>
                <NavLink to="/dashboard/my-classes" onClick={closeSidebar} className={navLinkStyle}>
                  <FiBookOpen className="w-5 h-5 shrink-0" />
                  <span>My Added Courses</span>
                </NavLink>
                <NavLink to="/dashboard/my-earnings" onClick={closeSidebar} className={navLinkStyle}>
                  <FaBangladeshiTakaSign className="w-5 h-5 shrink-0" />
                  <span>My Earnings</span>
                </NavLink>
              </>
            )}

            {role !== 'admin' && (
              <>
                <div className="pt-2 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Learner Hub
                </div>
                <NavLink to="/dashboard/myenroll-class" onClick={closeSidebar} className={navLinkStyle}>
                  <FiBookOpen className="w-5 h-5 shrink-0" />
                  <span>Enrolled Courses</span>
                </NavLink>
                <NavLink to="/dashboard/my-certificates" onClick={closeSidebar} className={navLinkStyle}>
                  <FiAward className="w-5 h-5 shrink-0" />
                  <span>My Certificates</span>
                </NavLink>
                <NavLink to="/dashboard/cart" onClick={closeSidebar} className={navLinkStyle}>
                  <FiShoppingCart className="w-5 h-5 shrink-0" />
                  <span>My Cart ({cart?.length || 0})</span>
                </NavLink>
                <NavLink to="/dashboard/payment-history" onClick={closeSidebar} className={navLinkStyle}>
                  <FiFileText className="w-5 h-5 shrink-0" />
                  <span>Payment History</span>
                </NavLink>
              </>
            )}

            {role === 'admin' && (
              <>
                <div className="pt-2 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Admin Tools
                </div>
                <NavLink to="/dashboard/all-classes" onClick={closeSidebar} className={navLinkStyle}>
                  <FiCheckSquare className="w-5 h-5 shrink-0" />
                  <span>All Classes</span>
                </NavLink>
                <NavLink to="/dashboard/manage-users" onClick={closeSidebar} className={navLinkStyle}>
                  <FiUsers className="w-5 h-5 shrink-0" />
                  <span>Manage Users</span>
                </NavLink>
                <NavLink to="/dashboard/teacher-requests" onClick={closeSidebar} className={navLinkStyle}>
                  <FiUserCheck className="w-5 h-5 shrink-0" />
                  <span>Teacher Requests</span>
                </NavLink>
                <NavLink to="/dashboard/manage-refunds" onClick={closeSidebar} className={navLinkStyle}>
                  <FiCornerUpLeft className="w-5 h-5 shrink-0" />
                  <span>Manage Refunds</span>
                </NavLink>
                <NavLink to="/dashboard/manage-payouts" onClick={closeSidebar} className={navLinkStyle}>
                  <FiCreditCard className="w-5 h-5 shrink-0" />
                  <span>Manage Payouts</span>
                </NavLink>
                <NavLink to="/dashboard/manage-newsletter" onClick={closeSidebar} className={navLinkStyle}>
                  <FiMail className="w-5 h-5 shrink-0" />
                  <span>Newsletter</span>
                </NavLink>
                <NavLink to="/dashboard/admin-financials" onClick={closeSidebar} className={navLinkStyle}>
                  <FaBangladeshiTakaSign className="w-5 h-5 shrink-0" />
                  <span>Financials & Payments</span>
                </NavLink>
                <NavLink to="/dashboard/platform-fee" onClick={closeSidebar} className={navLinkStyle}>
                  <FiPercent className="w-5 h-5 shrink-0" />
                  <span>Platform Fee</span>
                </NavLink>
              </>
            )}

            <div className="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Account
            </div>
            <NavLink to="/dashboard/profile" onClick={closeSidebar} className={navLinkStyle}>
              <FiUser className="w-5 h-5 shrink-0" />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-5 border-t border-stone-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-semibold transition-all"
          >
            <FiArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-sm font-semibold transition-all cursor-pointer"
          >
            <FiLogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200/80 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-stone-900 tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/allCourses"
              className="hidden sm:inline-flex text-xs font-bold px-4 py-2 bg-[#07A698]/10 text-[#07A698] hover:bg-[#07A698] hover:text-white rounded-lg transition-all"
            >
              Browse Courses
            </Link>
            <img
              src={dbUser?.photoURL || dbUser?.image || user?.photoURL || "https://i.ibb.co/mJRk027/default-avatar.png"}
              alt={dbUser?.name || user?.displayName || "Avatar"}
              className="w-9 h-9 rounded-full object-cover border border-stone-200"
            />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;