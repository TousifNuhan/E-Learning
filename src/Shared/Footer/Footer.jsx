import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Footer = () => {
    const axiosPublic = useAxiosPublic();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');

        try {
            const res = await axiosPublic.post('/newsletter/subscribe', { email });

            setStatus('success');
            setMessage(res.data?.message || 'Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }

        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 4000);
    };

    return (
        <footer className="bg-[#162726] text-gray-300 pt-16 pb-8 border-t border-teal-950/30 font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 box">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-700/20">

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                            <img src="https://wp.rrdevs.net/edcare/source/preview/assets/imgs/logo/logo-white.svg" alt="EdCare Logo" />
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                            Empowering personalized learning with AI assistance, recorded classes, and interactive assignments.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 tracking-wide uppercase text-xs text-opacity-90">Explore</h4>
                        <ul className="space-y-3 text-sm">
                            {['Home', 'All Courses', 'Teach on EduManage', 'Login'].map((link, idx) => {
                                const paths = ['/', '/classes', '/teach-on-edumanage', '/login'];
                                return (
                                    <li key={idx}>
                                        <Link to={paths[idx]} className="group relative block overflow-hidden h-5 w-fit">
                                            <span className="hover:text-[#07A698] transition-colors">
                                                {link}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 tracking-wide uppercase text-xs text-opacity-90">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <span className="block text-white text-xs font-semibold">Email Us</span>
                                <a href="mailto:support@edcare.com" className="hover:text-[#07A698] transition-colors">support@edcare.com</a>
                            </li>
                            <li>
                                <span className="block text-white text-xs font-semibold">Location</span>
                                <span>Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <h4 className="text-white font-bold tracking-wide uppercase text-xs text-opacity-90">Stay Updated</h4>
                        <p className="text-xs text-gray-400">Subscribe for course announcements and portal update metrics.</p>

                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-1">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status === 'error') setStatus('idle');
                                    }}
                                    placeholder="Enter email"
                                    disabled={status === 'loading'}
                                    className="px-4 py-2 text-sm bg-neutral-900/40 border border-gray-700/40 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#07A698] transition-colors w-full disabled:opacity-50"
                                />

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="group relative px-6 py-2.5 text-xs font-bold text-[#162726] rounded-full bg-[#3DF2C9] overflow-hidden flex-shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(61,242,201,0.4)] focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative block overflow-hidden h-4">
                                        <span className={`block transition-transform duration-500 ease-out transform ${status === 'loading' ? '-translate-y-full' : 'group-hover:-translate-y-full'}`}>
                                            {status === 'loading' ? 'Joining...' : 'Join Now'}
                                        </span>
                                        <span className={`absolute inset-0 block transition-transform duration-500 ease-out transform ${status === 'loading' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
                                            {status === 'loading' ? 'Joining...' : 'Join Now'}
                                        </span>
                                    </span>
                                </button>
                            </div>

                            {message && (
                                <p className={`text-xs ${status === 'error' ? 'text-red-400' : 'text-[#3DF2C9]'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>

                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <p>© {new Date().getFullYear()} EdCare. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;