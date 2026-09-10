import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const PersonalizedRecommendations = () => {
  const axiosSecure = useAxiosSecure();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['personalized-recommendations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/recommendations/personalized');
      return res.data;
    },
  });

  if (isLoading || courses.length === 0) return null;

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Recommended For You</h2>
          <p className="text-xs text-stone-500">Based on your learning history and enrolled topics</p>
        </div>
        <Link
          to="/allCourses"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#07A698] hover:text-[#05857a] transition-colors"
        >
          Explore All <FiArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/courseDetails/${course._id}`}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-36 bg-stone-100 overflow-hidden">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <FiBookOpen className="text-2xl" />
                  </div>
                )}
                {course.category && (
                  <span className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {course.category}
                  </span>
                )}
              </div>

              <div className="p-3.5 space-y-1">
                <h3 className="text-xs font-bold text-stone-900 line-clamp-2 group-hover:text-[#07A698] transition-colors break-words">
                  {course.title}
                </h3>
                {course.instructorName && (
                  <p className="text-[11px] text-stone-400 truncate">
                    By {course.instructorName}
                  </p>
                )}
              </div>
            </div>

            <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between border-t border-stone-100 text-xs">
              <span className="font-extrabold text-[#162726]">
                ${course.price !== undefined ? Number(course.price).toFixed(2) : '0.00'}
              </span>
              <span className="text-[11px] font-bold text-[#07A698] group-hover:translate-x-0.5 transition-transform">
                View Class →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;