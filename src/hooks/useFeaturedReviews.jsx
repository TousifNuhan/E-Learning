import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useFeaturedReviews = () => {
  const axiosSecure = useAxiosSecure();

  const { data: featuredReviews = [], isLoading, refetch } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reviews/featured');
      return res.data;
    },
  });

  return [featuredReviews, isLoading, refetch];
};

export default useFeaturedReviews;