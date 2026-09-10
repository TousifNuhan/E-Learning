import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);

        resetPassword(email)
            .then(() => {
                toast.success('Password reset email sent! Check your inbox.');
                setSent(true);
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    toast.error('No account found with this email.');
                } else {
                    toast.error(error.message || 'Failed to send reset email');
                }
            })
            .finally(() => setSending(false));
    };

    return (
        <div className="font-sans">
            <Helmet>
                <title>EdCare | Reset Password</title>
            </Helmet>
            <div className="w-full min-h-[calc(100vh-76px)] flex items-center justify-center bg-[#fafbfb] py-16 px-4">
                <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-2xl p-8 shadow-xs space-y-6">
                    <div className="text-center space-y-1.5">
                        <h1 className="text-2xl font-black text-[#162726] tracking-tight">Reset your password</h1>
                        <p className="text-xs text-stone-500">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {sent ? (
                        <div className="text-center space-y-4 pt-2">
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 leading-relaxed">
                                A recovery email has been dispatched to <span className="font-bold">{email}</span>. Please review your inbox or spam folder.
                            </div>
                            <Link
                                to="/login"
                                className="inline-block text-xs font-bold text-[#07A698] hover:text-[#05857a] hover:underline"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#07A698] focus:ring-1 focus:ring-[#07A698] transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full h-11 flex items-center justify-center bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <p className="text-center text-xs font-medium text-stone-500 pt-2">
                                Remember your password?{' '}
                                <Link to="/login" className="text-[#07A698] font-bold hover:underline">
                                    Back to Sign In
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;