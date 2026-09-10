import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5001'
});

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      function (response) {
        return response;
      },
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Eject these specific interceptors when this component unmounts
    // or when logout/navigate change, so they never stack up.
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;