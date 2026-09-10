import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';

const TeacherRoute = ({ children }) => {
  const { user, initializing } = useAuth();
  const [role, isRoleLoading] = useRole();
  const location = useLocation();

  if (initializing || isRoleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fafbfb]">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user && role?.toLowerCase() === 'teacher') {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default TeacherRoute;