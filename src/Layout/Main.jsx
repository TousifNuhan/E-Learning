import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import useAuth from '../hooks/useAuth';

const Main = () => {
    const { initializing } = useAuth();

    if (initializing) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fafbfb]">
                <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Main;