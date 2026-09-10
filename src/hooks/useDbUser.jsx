import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useDbUser = () => {
    const { user, initializing } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: dbUser = {}, isLoading } = useQuery({
        queryKey: ['dbUser', user?.email],
        enabled: !initializing && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        },
        staleTime: 1000 * 60,
    });

    return [dbUser, isLoading];
};

export default useDbUser;