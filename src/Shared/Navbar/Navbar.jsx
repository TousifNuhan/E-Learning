import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import '../Navbar/index.css';
import { AuthContext } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';

import {
    FiUser,
    FiHelpCircle,
    FiLogOut,
    FiChevronRight,
    FiShoppingCart
} from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import useDbUser from '../../hooks/useDbUser';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [dbUser] = useDbUser();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    
    const [cart] = useCart();

    const closeDropdown = () => {
        const elem = document.activeElement;
        if (elem) {
            elem.blur();
        }
    };

    const handleLogout = () => {
        closeDropdown();
        logout()
            .then(() => {
                toast.success("Logout Successful");
            })
            .catch(error => {
                toast.error(error);
            });
    };

    const isHomePage = location.pathname === "/";

    // Hide navbar on scroll-down, show it on scroll-up
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            setIsScrolled(currentY > 50);

            if (currentY > lastScrollY && currentY > 150) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Unified styling for links: dark on mobile dropdown, white on desktop navbar
    const navLinkStyle = ({ isActive }) => 
        `cursor-pointer text-sm md:text-base font-semibold tracking-wider uppercase antialiased transition-all duration-300 ease-in-out block py-2.5 lg:py-0 lg:px-4 ${
            isActive ? 'text-[#07A698]' : 'text-stone-700 lg:text-white hover:text-[#07A698]'
        }`;

    const navlinks1 = (
        <>
            <NavLink onClick={closeDropdown} className={navLinkStyle} to="/">
                Home
            </NavLink>
            <NavLink onClick={closeDropdown} className={navLinkStyle} to="/allCourses">
                All Courses
            </NavLink>
            <NavLink onClick={closeDropdown} className={navLinkStyle} to="/teachON">
                Teach on EdCare
            </NavLink>
            <NavLink onClick={closeDropdown} className={navLinkStyle} to="/about-us">
               About 
            </NavLink>
        </>
    );

   const getBackgroundClass = () => {
        // py-5 and py-6 control the height on internal pages
        if (!isHomePage) return 'bg-[#162726] shadow-md backdrop-blur-md py-5 md:py-6';
        
        // py-5/py-6 is the height when scrolled, py-6/py-8 is the height when at the very top
        return isScrolled ? 'bg-[#162726] shadow-md py-5 md:py-6' : 'bg-transparent py-6 md:py-8';
    };

    const getTextColorClass = () => {
        if (!isHomePage || isScrolled) return 'text-white';
        return 'text-white';
    };

    const translateClass = hidden ? '-translate-y-[140px] opacity-0' : 'translate-y-0 opacity-100';

    return (
        <div
            className={`w-full fixed z-50 transform ${translateClass} transition-all duration-600 ease-[cubic-bezier(.15,.85,.31,1)] ${getBackgroundClass()} ${getTextColorClass()}`}
        >
            <div className="navbar w-[95%] md:w-4/5 mx-auto z-50 p-0 min-h-0">
                <div className="navbar-start w-auto flex-1 lg:flex-none">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost p-1 mr-2 lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        {/* Fix: Replaced bg-base-100 and .menu with explicit bg-white and flex-col */}
                        <ul tabIndex={0} className="dropdown-content bg-white rounded-2xl z-[100] mt-5 w-56 p-5 shadow-2xl border border-stone-100 flex flex-col gap-1">
                            {navlinks1}
                        </ul>
                    </div>
                    <div className='flex items-center'>
                        <img 
                            src="https://wp.rrdevs.net/edcare/source/preview/assets/imgs/logo/logo-white.svg" 
                            alt="EdCare Logo" 
                            className="w-24 md:w-auto"
                        />
                    </div>
                </div>

                <div className="navbar-center hidden lg:flex flex-1 justify-center">
                    {/* Fix: Removed .menu class here too for consistency */}
                    <ul className="flex items-center gap-2">
                        {navlinks1}
                    </ul>
                </div>

                <div className="navbar-end w-auto flex-none gap-2 md:gap-4">
                    {
                        user ? (
                            <div className="flex items-center gap-2 md:gap-5">
                                <Link
                                    to="/dashboard/cart"
                                    className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-200 text-white"
                                    aria-label="View Cart"
                                >
                                    <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-[#07A698] transition-colors" />

                                    {cart.length > 0 && (
                                        <span className="absolute 0 md:-top-1 0 md:-right-1 bg-[#07A698] text-white text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-[#162726]">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>

                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="relative cursor-pointer focus:outline-none">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#07A698] transition-all duration-200">
                                            <img
                                                alt={dbUser?.name || user?.displayName || "User Avatar"}
                                                src={dbUser?.photoURL || dbUser?.image || user?.photoURL || "https://i.ibb.co/mJRk027/default-avatar.png"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 border-2 border-[#162726] rounded-full"></span>
                                    </div>

                                    <div
                                        tabIndex={0}
                                        className="dropdown-content z-[100] mt-4 w-[260px] md:w-80 p-4 md:p-5 bg-white text-stone-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-stone-100 space-y-3"
                                    >
                                        <div className="flex items-center gap-3 md:gap-4 pb-4 border-b border-stone-200">
                                            <img
                                                src={dbUser?.photoURL || dbUser?.image || user?.photoURL || "https://i.ibb.co/mJRk027/default-avatar.png"}
                                                alt="Avatar"
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm"
                                            />
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-stone-900 text-sm md:text-lg truncate">
                                                    {dbUser?.name || user?.displayName || "User"}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="space-y-1 pt-1">
                                            <Link
                                                to="/dashboard"
                                                onClick={closeDropdown}
                                                className="group flex items-center justify-between p-2 md:p-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-stone-100 group-hover:bg-white flex items-center justify-center text-stone-600 transition-colors">
                                                        <FiUser className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </div>
                                                    <span className="font-semibold text-xs md:text-sm">Dashboard</span>
                                                </div>
                                                <FiChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>

                                            <Link
                                                to="/about-us"
                                                onClick={closeDropdown}
                                                className="group flex items-center justify-between p-2 md:p-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-stone-100 group-hover:bg-white flex items-center justify-center text-stone-600 transition-colors">
                                                        <FiHelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </div>
                                                    <span className="font-semibold text-xs md:text-sm">About</span>
                                                </div>
                                                <FiChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full group flex items-center justify-between p-2 md:p-2.5 rounded-xl text-stone-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-stone-100 group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center text-stone-600 transition-colors">
                                                        <FiLogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </div>
                                                    <span className="font-semibold text-xs md:text-sm">Logout</span>
                                                </div>
                                                <FiChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="relative text-[11px] md:text-base font-semibold cursor-pointer z-20 text-white 
                                px-6 py-2 md:px-16 md:py-3 rounded-sm uppercase tracking-wider bg-[#07a698] 
                                overflow-hidden transition-all duration-500 ease-[cubic-bezier(.15,.85,.31,1)]
                                before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:bg-[#059983]
                                before:transition-all before:duration-500 before:ease-[cubic-bezier(.15,.85,.31,1)]
                                hover:before:w-full hover:text-white"
                            >
                                <span className="relative z-10 whitespace-nowrap">Sign In</span>
                            </NavLink>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;