import { useEffect, useState } from 'react';
import useAxiosPublic from './useAxiosPublic';

const useReviews = () => {
    const axiosPublic = useAxiosPublic();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosPublic.get('/reviews')
            .then(res => {
                setReviews(res.data || []);
            })
            .catch(err => {
                console.error('Failed to fetch reviews:', err);
                setReviews([]);
            })
            .finally(() => setLoading(false));
    }, [axiosPublic]);

    return [reviews, loading];
};

export default useReviews;