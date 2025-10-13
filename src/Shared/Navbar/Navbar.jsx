import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { NavLink } from 'react-router-dom';

import '../Navbar/index.css'

const Navbar = () => {

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [])

    const navlinks1 = <>
        <NavLink className='cursor-pointer text-lg font-semibold tracking-wider uppercase hover:text-[#07A698] antialiased transition-all duration-300 ease-in-out' to="/">Home</NavLink>
        <NavLink className='cursor-pointer text-base font-semibold tracking-wider uppercase hover:text-[#07A698] antialiased transition-all duration-300 ease-in-out px-8' to="/">All Classes</NavLink>
        <NavLink className='cursor-pointer text-base font-semibold tracking-wider uppercase hover:text-[#07A698] antialiased transition-all duration-300 ease-in-out' to="/">Teach on EdCare</NavLink>

    </>

    return (
        <div className={`w-full fixed z-20 py-5 ${isScrolled ? 'bg-[#162726] shadow-sm duration-300' : ''}`}>
            <div className="navbar w-4/5  mx-auto text-white">
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
                    {/* <NavLink  className="text-base font-semibold cursor-pointer z-50 text-white px-16 py-3 rounded-sm uppercase tracking-wider custom-ease bg-[#07a698] transition-all delay-300 ease-in-out relative">Sign In</NavLink> */}
                    <NavLink
                        className="relative text-base font-semibold cursor-pointer z-20 text-white 
  px-16 py-3 rounded-sm uppercase tracking-wider bg-[#07a698] 
  overflow-hidden transition-all duration-500 ease-[cubic-bezier(.15,.85,.31,1)]
  before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:bg-[#059983]
  before:transition-all before:duration-500 before:ease-[cubic-bezier(.15,.85,.31,1)]
  hover:before:w-full hover:text-white"
                    >
                        <span className="relative z-10">Sign In</span>
                    </NavLink>


                </div>
            </div>
        </div>
    );
};

export default Navbar;