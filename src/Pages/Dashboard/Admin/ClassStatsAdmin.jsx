import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FiArrowLeft, FiDollarSign, FiUsers, FiBookOpen, 
  FiTrendingUp, FiCheckCircle, FiAlertCircle, FiActivity 
} from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ClassStatsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: statsData = {}, isLoading, isError } = useQuery({
    queryKey: ['class-stats', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/classes/stats/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center py-24 m-6 font-sans">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-stone-600">Loading Class Analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-red-200 text-center py-16 m-6 font-sans">
        <p className="text-red-500 font-bold">Failed to load analytics for this class.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 bg-stone-100 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { 
    classDetails = {}, 
    totalRevenue = 0, 
    totalEnrollments = 0, 
    recentEnrollments = [] 
  } = statsData;

  const classTitle = classDetails.title || classDetails.className || classDetails.name || 'Untitled Class';
  const classImage = classDetails.image || classDetails.bannerImage || classDetails.photo || classDetails.coverImage;
  const classCategory = classDetails.category || classDetails.subject || 'General';
  
  const teacherName = classDetails.instructorName || classDetails.teacherName || classDetails.name || classDetails.instructorDetails?.name || classDetails.instructorDetails?.title || 'Unknown Instructor';
  const teacherEmail = classDetails.instructorEmail || classDetails.teacherEmail || classDetails.email || 'N/A';

  const coursePrice = Number(classDetails.price || classDetails.cost || classDetails.coursePrice || 0);
  const parsedRevenue = Number(totalRevenue || classDetails.totalRevenue || 0);
  const parsedEnrollments = Number(totalEnrollments || classDetails.totalEnrollment || classDetails.totalEnrolled || 0);
  
  const totalModules = Array.isArray(classDetails.modules) 
    ? classDetails.modules.length 
    : (classDetails.totalModules || classDetails.modulesCount || 0);

  return (
    <div className="space-y-6 bg-[#fafbfb] min-h-screen p-4 md:p-6 font-sans text-stone-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer w-fit"
        >
          <FiArrowLeft className="shrink-0" /> Back to All Classes
        </button>
        <span className="text-xs font-mono text-stone-400 break-all">Class ID: {id}</span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {classImage ? (
            <img
              src={classImage}
              alt={classTitle}
              className="w-20 h-16 object-cover rounded-xl border border-stone-200 bg-stone-100 shrink-0"
            />
          ) : (
            <div className="w-20 h-16 rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400 shrink-0">
              No Image
            </div>
          )}
          <div className="min-w-0">
            <span className="inline-block text-[10px] font-bold uppercase bg-[#07A698]/10 text-[#07A698] px-2.5 py-0.5 rounded-md">
              {classCategory}
            </span>
            <h2 className="text-lg font-black text-stone-900 mt-1 break-words">{classTitle}</h2>
            <p className="text-xs text-stone-500 break-words">
              Instructor: <span className="font-semibold text-stone-800">{teacherName}</span> ({teacherEmail})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-stone-900 mt-1">
              ${parsedRevenue.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0"><FiDollarSign className="text-xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#07A698] uppercase tracking-wider">Total Enrolled</p>
            <p className="text-2xl font-black text-[#07A698] mt-1">{parsedEnrollments}</p>
          </div>
          <div className="p-3 bg-[#07A698]/10 rounded-xl text-[#07A698] shrink-0"><FiUsers className="text-xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Course Price</p>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {coursePrice === 0 ? 'FREE' : `$${coursePrice.toFixed(2)}`}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0"><FiTrendingUp className="text-xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Modules</p>
            <p className="text-2xl font-black text-indigo-700 mt-1">{totalModules}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0"><FiBookOpen className="text-xl" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <FiActivity className="text-[#07A698] shrink-0" /> Recent Student Enrollments
          </h3>
          <span className="text-xs text-stone-400">Showing last {recentEnrollments.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <th className="p-4">Student</th>
                <th className="p-4">Email</th>
                <th className="p-4">Enrollment Date</th>
                <th className="p-4 text-center">Amount Paid</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((student, idx) => {
                  const studentName = student.userName || student.name || student.studentName || student.customerName || student.user?.name || student.userEmail?.split('@')[0] || 'Enrolled Student';
                  const studentEmail = student.userEmail || student.email || student.customerEmail || 'N/A';
                  const studentPrice = Number(student.amountPaid || student.price || student.amount || 0);
                  const enrollmentDate = student.enrolledAt || student.paidAt || student.createdAt || student.date;
                  const isRefunded = student.status === 'refunded';

                  return (
                    <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 font-bold text-stone-800 break-words">
                        {studentName}
                      </td>
                      <td className="p-4 font-mono text-stone-500 break-all">
                        {studentEmail}
                      </td>
                      <td className="p-4 text-stone-500 whitespace-nowrap">
                        {enrollmentDate ? new Date(enrollmentDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-center font-black text-stone-900 whitespace-nowrap">
                        ${studentPrice.toFixed(2)}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {isRefunded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 rounded-full">
                            <FiAlertCircle className="shrink-0" /> Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                            <FiCheckCircle className="shrink-0" /> Enrolled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-stone-400">
                    No student enrollments recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassStatsAdmin;