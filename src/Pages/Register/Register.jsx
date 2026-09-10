import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { AuthContext } from '../../providers/AuthProvider';
import { updateProfile } from 'firebase/auth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import SocialLogin from '../../Shared/SocialLogin/SocialLogin';
import useAuth from '../../hooks/useAuth';

const Register = () => {
    const axiosPublic = useAxiosPublic();
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useContext(AuthContext);
    const { user, loading, setLoading, initializing } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    if (!initializing && user) {
        return <Navigate to={from} replace />;
    }

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const photoURL = form.photoURL.value;
        const email = form.email.value;
        const password = form.password.value;

        if (password.length < 6) {
            toast.error("Password should be more than 6 characters");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error("You must include at least one uppercase letter");
            return;
        }
        if (!/[0-9]/.test(password)) {
            toast.error("You must include at least one number");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            toast.error("You must include at least one special character");
            return;
        }

        register(email, password)
            .then((res) => {
                updateProfile(res.user, {
                    displayName: name,
                    photoURL: photoURL,
                })
                    .then(() => {
                        const userInfo = { name, email, photoURL };

                        axiosPublic.post('/users', userInfo)
                            .then((res) => {
                                if (res.data.insertedId) {
                                    toast.success("Registration successful!");
                                    form.reset();
                                } else {
                                    toast.error(res.data.message || "User already exists!");
                                }
                            })
                            .catch((err) => {
                                toast.error("Failed to save user info.");
                            });
                    })
                    .catch((err) => {
                        toast.error("Failed to update profile details.");
                    });
            })
            .catch((error) => {
                setLoading(false);
                if (error.code === 'auth/email-already-in-use') {
                    toast.error("This email is already registered. Please sign in instead!");
                    navigate('/login');
                } else {
                    toast.error(error.message || "Registration attempt failed");
                }
            });
    };

    return (
        <div>
            <Helmet>
                <title>EdCare | Register</title>
            </Helmet>
            
            <div className="w-full  flex flex-col lg:grid lg:grid-cols-12 bg-white font-sans text-stone-700 antialiased selection:bg-[#735349]/20">

                <div className="w-full lg:col-span-5 xl:col-span-4 flex flex-col justify-between pt-24 p-8 md:p-8 md:pt-32 lg:p-16 bg-white z-10 relative  lg:min-h-0">

                    <div className="hidden lg:flex items-center justify-start pt-24">
                        <Link to="/" className="flex items-center gap-1 select-none">
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

                    <div className="w-full max-w-sm mx-auto space-y-6 md:space-y-8 my-auto py-8 lg:py-6">
                        <div className="space-y-1.5 lg:hidden">
                            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Create Account</h1>
                            <p className="text-xs text-stone-500">Sign up to get started with EdCare.</p>
                        </div>

                        <form onSubmit={handleRegisterSubmit} className="space-y-5 md:space-y-6">

                            <div className="relative border-b border-stone-200 focus-within:border-[#735349] transition-colors duration-300 pb-2">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Full Name"
                                    className="w-full bg-transparent text-[15px] text-stone-900 border-none outline-none focus:ring-0 placeholder-stone-400/80 font-normal py-1"
                                />
                            </div>

                            <div className="relative border-b border-stone-200 focus-within:border-[#735349] transition-colors duration-300 pb-2">
                                <input
                                    type="url"
                                    name="photoURL"
                                    required
                                    placeholder="Photo URL (e.g., https://...)"
                                    className="w-full bg-transparent text-[15px] text-stone-900 border-none outline-none focus:ring-0 placeholder-stone-400/80 font-normal py-1"
                                />
                            </div>

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

                            <div className="flex items-start gap-2 pt-1 select-none">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    required
                                    className="w-3.5 h-3.5 mt-0.5 rounded text-[#735349] border-stone-300 focus:ring-[#735349] cursor-pointer"
                                />
                                <label htmlFor="agreeToTerms" className="text-xs text-stone-500 font-medium leading-tight cursor-pointer">
                                    I agree to the <Link to="/terms" className="text-[#735349] hover:underline">Terms</Link> and <Link to="/privacy" className="text-[#735349] hover:underline">Privacy Policy</Link>.
                                </label>
                            </div>

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    className="w-full h-[46px] flex items-center justify-center bg-[#735349] hover:bg-[#5c423a] text-white font-bold text-xs uppercase tracking-widest rounded-xl lg:rounded transition-all duration-300 cursor-pointer shadow-sm"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        <div className="relative flex items-center justify-center my-4">
                            <div className="border-t border-stone-200 w-full"></div>
                            <span className="bg-white px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider absolute">Or</span>
                        </div>

                        <SocialLogin />

                        <p className="text-center text-xs font-medium text-stone-500 tracking-wide">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[#735349] font-bold hover:underline transition-all ml-0.5"
                            >
                                Sign In!
                            </Link>
                        </p>
                    </div>

                    <div className="text-center lg:pt-4 border-t border-stone-100/70">
                        <p className="text-[10px] font-mono font-medium tracking-wider text-stone-400">
                            Copyright © 2026 <span className="text-[#735349] font-semibold">EdCare</span>. All Rights Reserved.
                        </p>
                    </div>

                </div>

                <div className="hidden lg:block lg:col-span-7 xl:col-span-8 relative bg-stone-900 select-none min-h-[calc(100vh-76px)]">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
                        alt="Workspace collaborative side context view"
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.95] contrast-[1.01]"
                    />
                </div>

            </div>
        </div>
    );
};

export default Register;