import React from 'react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const SocialLogin = () => {
  const { googleLogin, githubLogin, setLoading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const handleGithubLogin = async () => {
    try {
      const res = await githubLogin();
      const userInfo = {
        email: res.user?.email,
        name: res.user?.displayName || res.user?.email?.split('@')[0] || 'User',
        photoURL: res.user?.photoURL || ''
      };

      try {
        await axiosPublic.post('/users', userInfo);
      } catch (dbErr) {
        // Auth succeeds even if DB record creation fails; let auth state progress
      }

      toast.success("Login successful!");
    } catch (error) {
      toast.error(error?.message || "Login attempt failed");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();
      const userInfo = {
        email: res.user?.email,
        name: res.user?.displayName || 'User',
        photoURL: res.user?.photoURL || ''
      };

      try {
        await axiosPublic.post('/users', userInfo);
      } catch (dbErr) {
        // Auth succeeds even if DB record creation fails; let auth state progress
      }

      toast.success("Login successful!");
    } catch (error) {
      toast.error(error?.message || "Login attempt failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 pt-1 font-sans">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-1/2 h-11 flex items-center justify-center gap-2 border border-stone-200/90 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded transition-all duration-200 cursor-pointer text-xs font-bold shadow-xs active:scale-[0.99]"
      >
        <FaGoogle className="text-stone-600 text-sm shrink-0" />
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={handleGithubLogin}
        className="w-1/2 h-11 flex items-center justify-center gap-2 border border-stone-200/90 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded transition-all duration-200 cursor-pointer text-xs font-bold shadow-xs active:scale-[0.99]"
      >
        <FaGithub className="text-stone-800 text-base shrink-0" />
        <span>GitHub</span>
      </button>
    </div>
  );
};

export default SocialLogin;