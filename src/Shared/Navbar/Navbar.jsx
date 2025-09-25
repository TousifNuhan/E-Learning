import React from 'react';
import { Button } from "@/components/ui/button"
import { NavLink } from 'react-router-dom';

import '../Navbar/index.css'

const Navbar = () => {

    const navlinks1 = <>
        <NavLink className='cursor-pointer text-base font-semibold tracking-wider uppercase hover:text-[#07A698] antialiased transition-all duration-300 ease-in-out' to="/">Home</NavLink>
        <NavLink className='cursor-pointer text-base font-semibold tracking-wider uppercase hover:text-[#07A698] antialiased transition-all duration-300 ease-in-out px-8' to="/">All Classes</NavLink>
        <NavLink className='cursor-pointer text-base font-semibold tracking-wider uppercase hover:text-[#07A698] antialiased transition-all duration-300 ease-in-out' to="/">Teach on EdCare</NavLink>

    </>

    return (
        <div className='w-4/5 mx-auto '>
            <div className="navbar  shadow-sm bg-[#162726] text-white">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {
                                navlinks1
                            }
                        </ul>
                    </div>
                    <div className='flex items-center'>
                        <img src="https://wp.rrdevs.net/edcare/source/preview/assets/imgs/logo/logo-white.svg" alt="" />
                        {/* <h2 className='text-2xl font-semibold'>SkillHive</h2> */}
                    </div>
                    {/* <a className="btn btn-ghost text-xl"></a> */}
                </div>
                <div className="navbar-center hidden lg:flex  ">
                    <ul className="menu menu-horizontal px-1">
                        {
                            navlinks1
                        }
                    </ul>
                </div>
                <div className="navbar-end">
                    <NavLink  className="text-base font-semibold cursor-pointer bg-white text-black px-8 py-3 rounded-3xl uppercase  tracking-wider  hover:text-[#162726] custom-ease  ">Sign in</NavLink>
                    

                </div>
            </div>
        </div>
    );
};

export default Navbar;