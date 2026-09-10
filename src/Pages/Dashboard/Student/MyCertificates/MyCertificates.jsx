import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiAward, FiCheckCircle, FiClock, FiInbox } from 'react-icons/fi';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';


const MyCertificates = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // 1. Fetch enrolled courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['my-enrolled-classes'],
    queryFn: async () => {
      const res = await axiosSecure.get('/enrolled-classes');
      return res.data;
    },
  });

  const activeCourses = courses.filter(
    c => c.paymentStatus !== 'refunded' && c.refundStatus !== 'approved'
  );

  const classIds = activeCourses.map(c => c.classId || c._id).filter(Boolean);

  // 2. Bulk-check certificate eligibility for all enrolled courses at once
  const { data: statusMap = {}, isLoading: statusLoading } = useQuery({
    queryKey: ['certificate-status-bulk', classIds],
    queryFn: async () => {
      const res = await axiosSecure.post('/certificate/status/bulk', { classIds });
      return res.data;
    },
    enabled: classIds.length > 0,
  });

  const isLoading = coursesLoading || statusLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfb] p-6 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-semibold text-stone-500">Checking your certificates...</p>
      </div>
    );
  }

  // Only show courses that actually have a status entry (i.e. student is enrolled and has assignments)
  const eligibleList = classIds
    .map(id => ({ id, ...statusMap[id] }))
    .filter(entry => entry.courseTitle); // filters out any classIds the backend skipped

  return (
    <div className="min-h-screen bg-[#fafbfb] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <FiAward className="text-[#07A698]" />
          My Certificates
        </h1>
        <p className="text-xs md:text-sm text-stone-500 mt-1">
          Track your certificate eligibility across all enrolled courses.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {eligibleList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <FiInbox className="text-4xl text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base">No courses with assignments yet</h3>
            <p className="text-xs text-stone-500 mt-1">
              Certificates become available once a course's assignments are set up and graded.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {eligibleList.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-stone-900 text-sm break-words">
                    {course.courseTitle}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                    {course.eligible ? (
                      <>
                        <FiCheckCircle className="text-emerald-500 shrink-0" />
                        All assignments passed
                      </>
                    ) : (
                      <>
                        <FiClock className="text-amber-500 shrink-0" />
                        {course.passedAssignments}/{course.totalAssignments} assignments passed
                      </>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/dashboard/certificate/${course.id}`)}
                  disabled={!course.eligible}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    course.eligible
                      ? 'bg-[#07A698] hover:bg-[#05857a] text-white cursor-pointer shadow-xs'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <FiAward className="text-sm" />
                  {course.eligible ? 'View Certificate' : 'Not Yet Eligible'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;