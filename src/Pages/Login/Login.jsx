import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../providers/AuthProvider';
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import toast from 'react-hot-toast';
import SocialLogin from '../../Shared/SocialLogin/SocialLogin';

const Login = () => {
    const { user, loading, login, setLoading, initializing } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const rawFrom = location.state?.from?.pathname;
    const from = (rawFrom && rawFrom !== '/login' && rawFrom !== '/register') ? rawFrom : '/dashboard';

    if (!initializing && user) {
        return <Navigate to={from} replace />;
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        login(email, password)
            .then(() => {
                toast.success("Login successful!");
            })
            .catch(error => {
                toast.error("Invalid email or password");
                setLoading(false);
            });
    };

    return (
        <div>
            <Helmet>
                <title>EdCare | Login</title>
            </Helmet>
            
            <div className="w-full  flex flex-col lg:grid lg:grid-cols-12 bg-white font-sans text-stone-700 antialiased selection:bg-[#735349]/20">

                <div className="w-full lg:col-span-5 xl:col-span-4 flex flex-col justify-between pt-24 p-8 md:p-8 md:pt-32 lg:p-16 bg-white z-10 relative  lg:min-h-0 ">

                    <div className="lg:flex items-center justify-start pt-24 hidden lg:visible">
                        <Link to="/" className="flex items-center gap-1 select-none lg:">
                            <div className="relative w-[26px] h-[26px] flex items-center justify-center">
                                <span className="text-2xl md:text-3xl font-black text-[#1e2125] tracking-tight ml-1 font-sans">
                                    Ed
                                </span>
                                <span className="absolute w-2.5 h-2.5 rounded-full bg-[#735349] top-[-1.5px] right-[-1.5px]" />
                            </div>
                            <span className="text-2xl md:text-3xl font-black text-[#1e2125] tracking-tight ml-1 font-sans">
                                Care
                            </span>
                        </Link>
                    </div>

                    <div className="w-full max-w-sm mx-auto space-y-6 md:space-y-8 my-auto pt-8 lg:py-6">
                        <div className="space-y-1.5 lg:hidden">
                            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Welcome Back</h1>
                            <p className="text-xs text-stone-500">Sign in to access your dashboard and courses.</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-5 md:space-y-6">

                            <div className="relative border-b border-stone-200 focus-within:border-[#735349] transition-colors duration-300 pb-2">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email Address"
                                    className="w-full bg-transparent text-[15px] text-stone-900 border-none outline-none focus:ring-0 placeholder-stone-400/80 font-normal py-1"
                                />
                            </div>

                            <div className="relative border-b border-stone-200 focus-within:border-[#735349] transition-colors duration-300 pb-2 flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="Password"
                                    className="w-full bg-transparent text-[15px] text-stone-900 border-none outline-none focus:ring-0 placeholder-stone-400/80 font-normal py-1 pr-8"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 cursor-pointer z-10 p-1"
                                    aria-label="Toggle password visibility"
                                >
                                    {
                                        showPassword ?
                                            <PiEyeLight className='h-5 w-5 text-stone-500 hover:text-stone-700 transition-colors' /> :
                                            <PiEyeSlash className='h-5 w-5 text-stone-500 hover:text-stone-700 transition-colors' />
                                    }
                                </span>
                            </div>

                            <div className="flex items-center justify-end pt-1">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-[#735349] hover:underline tracking-wide transition-all"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    className="w-full h-[46px] flex items-center justify-center bg-[#735349] hover:bg-[#5c423a] text-white font-bold text-xs uppercase tracking-widest rounded-xl lg:rounded transition-all duration-300 cursor-pointer shadow-sm"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>

                        <div className="relative flex items-center justify-center my-4">
                            <div className="border-t border-stone-200 w-full"></div>
                            <span className="bg-white px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider absolute">Or</span>
                        </div>

                        <SocialLogin />

                        <p className="text-center text-xs font-medium text-stone-500 tracking-wide">
                            New to EdCare?{' '}
                            <Link
                                to="/register"
                                className="text-[#735349] font-bold hover:underline transition-all ml-0.5"
                            >
                                Sign Up!
                            </Link>
                        </p>
                    </div>

                    <div className="text-center pt-6 lg:pt-4 border-t border-stone-100/70">
                        <p className="text-[10px] font-mono font-medium tracking-wider text-stone-400">
                            Copyright © 2026 <span className="text-[#735349] font-semibold">EdCare</span>. All Rights Reserved.
                        </p>
                    </div>

                </div>

                <div className="hidden lg:block lg:col-span-7 xl:col-span-8 relative bg-stone-900 select-none min-h-[calc(100vh-76px)]">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
                        alt="Workspace side profile presentation context"
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.95] contrast-[1.01]"
                    />
                </div>

            </div>
        </div>
    );
};

export default Login;