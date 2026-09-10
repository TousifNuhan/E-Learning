import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';

const AdminRoute = ({ children }) => {
    const { user, initializing } = useAuth();
    const [role, isRoleLoading] = useRole();
    const location = useLocation();

    if (initializing || isRoleLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-ring loading-xl text-[#07A698]"></span>
            </div>
        );
    }

    if (user && role === 'admin') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;