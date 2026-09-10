import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user, initializing } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: role, isPending: isRolePending } = useQuery({
        queryKey: [user?.email, 'userRole'],
        enabled: !initializing && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data?.role || 'student';
        },
        staleTime: 5 * 60 * 1000,
    });

    const isRoleLoading = initializing || (!!user?.email && isRolePending);

    return [role, isRoleLoading];
};

export default useRole;