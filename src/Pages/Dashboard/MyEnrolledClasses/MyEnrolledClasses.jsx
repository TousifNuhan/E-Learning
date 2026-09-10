import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiPlayCircle, FiBookOpen, FiAlertCircle,
  FiCheckCircle, FiCreditCard
} from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import PersonalizedRecommendations from '../Student/PersonalizedRecommendations/PersonalizedRecommendations';

const MyEnrolledClasses = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');

  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['my-enrolled-classes'],
    queryFn: async () => {
      const res = await axiosSecure.get('/enrolled-classes');
      return res.data;
    },
  });

  const filteredCourses = courses.filter(course => {
    const isRefunded = course.paymentStatus === 'refunded' || course.refundStatus === 'approved';

    if (isRefunded) return false;

    const progress = course.progressPercent || 0;

    if (activeTab === 'in-progress') return progress > 0 && progress < 100;
    if (activeTab === 'completed') return progress === 100;

    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfb] p-6 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-semibold text-stone-500">Loading your learning portal...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#fafbfb] p-6 flex flex-col items-center justify-center font-sans">
        <FiAlertCircle className="text-red-500 text-4xl mb-2" />
        <h3 className="text-base font-bold text-stone-800">Unable to load courses</h3>
        <p className="text-xs text-stone-500 mb-4">Check your internet connection or login status.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfb] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
          My Learning Portal
        </h1>
        <p className="text-xs md:text-sm text-stone-500 mt-1">
          Manage your course enrollments, track progress, and access class materials.
        </p>

        <div className="flex items-center gap-2 mt-6 border-b border-stone-200 overflow-x-auto pb-px">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#07A698] text-[#07A698]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              const progress = course.progressPercent || 0;
              const isRefundPending = course.refundStatus === 'pending';
              const targetId = course.classId || course._id;

              return (
                <div
                  key={course.enrollmentId || course._id || idx}
                  className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100 overflow-hidden">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 font-bold text-xs">
                          No Preview Available
                        </div>
                      )}

                      <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        {course.category}
                      </span>

                      {isRefundPending && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                          Refund Pending
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-stone-900 text-base line-clamp-1 group-hover:text-[#07A698] transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-stone-500">
                        Instructor: <span className="font-semibold text-stone-700">{course.instructorName}</span>
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-stone-500 flex items-center gap-1">
                            {progress === 100 && <FiCheckCircle className="text-[#07A698]" />}
                            {progress}% Complete
                          </span>
                          <span className="text-stone-400">
                            {course.completedCount || 0}/{course.totalLessons || 0} Lessons
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#07A698] transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-stone-100/60 mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/myenroll-class/${targetId}`)}
                      className="flex-1 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <FiPlayCircle className="text-sm" />
                      {progress > 0 ? 'Continue Class' : 'Start Learning'}
                    </button>

                    <button
                      onClick={() => navigate('/dashboard/payment-history')}
                      title="Manage Billing & Refunds"
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <FiCreditCard className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12">
            <FiBookOpen className="text-4xl text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base">No courses found</h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              You haven't enrolled in any courses under this category yet.
            </p>
            <button
              onClick={() => navigate('/allCourses')}
              className="px-5 py-2.5 bg-[#07A698] text-white rounded-xl text-xs font-bold hover:bg-[#05857a] transition-all cursor-pointer"
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        <PersonalizedRecommendations />
      </div>
    </div>
  );
};

export default MyEnrolledClasses;