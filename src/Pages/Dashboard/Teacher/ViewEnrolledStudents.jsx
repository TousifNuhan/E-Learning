import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowLeft, FiMail } from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ViewEnrolledStudents = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [data, setData] = useState({ classTitle: '', totalStudents: 0, students: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axiosSecure.get(`/classes/${id}/students`);
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load enrolled students.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [id, axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center font-sans">
                <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 font-sans">
                <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 text-rose-600 text-sm font-semibold">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
            <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(`/dashboard/my-class/${id}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 mb-2 cursor-pointer"
                    >
                        <FiArrowLeft className="w-3 h-3" /> Back to Class
                    </button>
                    <h1 className="text-xl sm:text-2xl font-black text-[#162726] flex items-center gap-2">
                        <FiUsers className="text-[#07A698] shrink-0" /> 
                        <span className="break-words">Enrolled Students</span>
                    </h1>
                    <p className="text-xs text-stone-500 font-medium break-words">
                        {data.classTitle}
                    </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                    <p className="text-3xl font-black text-[#162726]">{data.totalStudents}</p>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Students</p>
                </div>
            </div>

            {data.students.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    No students enrolled yet.
                </div>
            ) : (
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[600px]">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Enrolled On</th>
                                    <th className="p-4">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[#162726]">
                                {data.students.map((student) => (
                                    <tr key={student.userEmail} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={student.userImage || 'https://i.ibb.co/mJRk027/default-avatar.png'}
                                                    alt={student.userName}
                                                    className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0"
                                                />
                                                <span className="font-bold break-words">{student.userName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-stone-500 font-medium">
                                            <span className="flex items-center gap-1.5 break-all">
                                                <FiMail className="text-stone-400 shrink-0" />
                                                {student.userEmail}
                                            </span>
                                        </td>
                                        <td className="p-4 text-stone-500 font-medium whitespace-nowrap">
                                            {student.enrolledAt
                                                ? new Date(student.enrolledAt).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric'
                                                  })
                                                : 'N/A'}
                                        </td>
                                        <td className="p-4 font-mono text-stone-500 truncate max-w-[160px]">
                                            {student.transactionId}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewEnrolledStudents;