import { useQuery } from '@tanstack/react-query'; // or useState/useEffect if you're not using react-query
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useEnrolledClassIds = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: enrolledIds = [], isLoading } = useQuery({
        queryKey: ['enrolled-ids', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/enrolled-classes');
            // returns array of enrollment objects with classId
            return res.data.map(item => item.classId?.toString());
        }
    });

    return [enrolledIds, isLoading];
};

export default useEnrolledClassIds;