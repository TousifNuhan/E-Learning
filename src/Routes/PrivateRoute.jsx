import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, initializing } = useContext(AuthContext);
  const location = useLocation();

  if (initializing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fafbfb]">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;