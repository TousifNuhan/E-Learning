import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import {
    FiGithub,
    FiClock,
    FiCheckCircle,
    FiArrowLeft,
    FiUser,
    FiInbox
} from 'react-icons/fi';

const GradeSubmissions = () => {
    const { classId } = useParams();
    const [searchParams] = useSearchParams();
    const assignmentFilter = searchParams.get('assignmentId');

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState('pending');
    const [gradeInputs, setGradeInputs] = useState({});
    const [feedbackInputs, setFeedbackInputs] = useState({});
    const [submittingId, setSubmittingId] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['class-submissions', classId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions/class/${classId}`);
            return res.data;
        },
        enabled: !!classId,
    });

    const allSubmissions = data?.submissions || [];

    const submissions = assignmentFilter
        ? allSubmissions.filter(s => s.assignmentId === assignmentFilter)
        : allSubmissions;

    const filteredSubmissions = submissions.filter((s) => {
        if (filter === 'pending') return s.status !== 'graded';
        if (filter === 'graded') return s.status === 'graded';
        return true;
    });

    const pendingCount = submissions.filter(s => s.status !== 'graded').length;
    const gradedCount = submissions.filter(s => s.status === 'graded').length;

    const handleGradeSubmit = async (submissionId) => {
        const rawGrade = gradeInputs[submissionId];
        const grade = Number(rawGrade);

        if (rawGrade === undefined || rawGrade === '' || isNaN(grade) || grade < 0 || grade > 100) {
            toast.error('Please enter a grade between 0 and 100');
            return;
        }

        setSubmittingId(submissionId);
        try {
            await axiosSecure.patch(`/submissions/${submissionId}/grade`, {
                grade,
                feedback: feedbackInputs[submissionId] || ''
            });
            toast.success('Submission graded successfully!');
            queryClient.invalidateQueries(['class-submissions', classId]);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to submit grade');
        } finally {
            setSubmittingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 min-h-[400px] flex flex-col items-center justify-center text-stone-500 font-sans">
                <div className="animate-spin h-8 w-8 border-4 border-[#07A698] border-t-transparent rounded-full mb-3" />
                <p className="text-xs font-semibold uppercase tracking-wider">Loading submissions...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-2 font-sans">
                <p className="text-sm font-bold text-rose-600">Failed to load submissions</p>
                <p className="text-xs text-stone-500">You may not have permission to view this class, or it doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans">
            <div className="mb-6 space-y-3">
                <Link
                    to="/dashboard/my-classes"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                    <FiArrowLeft /> Back to My Classes
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl md:text-2xl font-bold text-stone-900 break-words">
                            {data?.classTitle || 'Class'} — Submissions
                        </h1>
                        <p className="text-xs text-stone-500 mt-1 break-words">
                            {assignmentFilter
                                ? `Showing submissions for: ${submissions[0]?.assignmentTitle || 'this assignment'}`
                                : `${data?.totalAssignments || 0} assignment${data?.totalAssignments === 1 ? '' : 's'} configured for this class`}
                        </p>
                    </div>
                    <div className="flex gap-2 text-xs font-bold shrink-0">
                        <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            {pendingCount} Pending
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {gradedCount} Graded
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-stone-200 overflow-x-auto scrollbar-none">
                {[
                    { key: 'pending', label: `Pending (${pendingCount})` },
                    { key: 'graded', label: `Graded (${gradedCount})` },
                    { key: 'all', label: `All (${submissions.length})` }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                            filter === tab.key
                                ? 'border-[#07A698] text-[#07A698]'
                                : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {filteredSubmissions.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400">
                    <FiInbox className="text-3xl mx-auto mb-2 text-stone-300" />
                    <p className="text-xs font-semibold">
                        {filter === 'pending'
                            ? 'No pending submissions to grade right now.'
                            : filter === 'graded'
                                ? 'No submissions have been graded yet.'
                                : 'No submissions found for this class yet.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSubmissions.map((sub) => {
                        const isGraded = sub.status === 'graded';
                        const isSubmittingThis = submittingId === sub._id;

                        return (
                            <div key={sub._id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                                            <FiUser className="text-stone-400 text-sm shrink-0" />
                                            <span className="break-words">{sub.userName || sub.userEmail}</span>
                                        </div>
                                        <p className="text-xs text-stone-500 break-all">{sub.userEmail}</p>
                                        <p className="text-xs font-semibold text-[#07A698] pt-1 break-words">{sub.assignmentTitle}</p>
                                    </div>

                                    <span className={`shrink-0 self-start px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                                        isGraded
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                        {isGraded ? (
                                            <><FiCheckCircle /> Graded: {sub.grade}/100</>
                                        ) : (
                                            <><FiClock /> Awaiting Grade</>
                                        )}
                                    </span>
                                </div>

                                <div className="overflow-hidden">
                                    <a
                                        href={sub.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#07A698] bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-2 rounded-lg transition-colors max-w-full"
                                    >
                                        <FiGithub className="shrink-0" /> 
                                        <span className="truncate">{sub.githubLink}</span>
                                    </a>
                                </div>

                                <p className="text-[11px] text-stone-400">
                                    Submitted {new Date(sub.submittedAt).toLocaleString()}
                                    {isGraded && sub.gradedAt && (
                                        <> · Graded {new Date(sub.gradedAt).toLocaleString()}</>
                                    )}
                                </p>

                                {isGraded && sub.feedback && (
                                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                                        <p className="text-xs text-stone-600 break-words">
                                            <span className="font-bold text-stone-800">Feedback: </span>{sub.feedback}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-2 border-t border-stone-100 space-y-2">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Grade (0-100)"
                                            defaultValue={isGraded ? sub.grade : ''}
                                            onChange={(e) =>
                                                setGradeInputs((prev) => ({ ...prev, [sub._id]: e.target.value }))
                                            }
                                            className="w-full sm:w-32 p-2.5 border border-stone-300 rounded-lg text-xs outline-none focus:border-[#07A698]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Feedback (optional)"
                                            defaultValue={isGraded ? sub.feedback : ''}
                                            onChange={(e) =>
                                                setFeedbackInputs((prev) => ({ ...prev, [sub._id]: e.target.value }))
                                            }
                                            className="flex-1 p-2.5 border border-stone-300 rounded-lg text-xs outline-none focus:border-[#07A698]"
                                        />
                                        <button
                                            onClick={() => handleGradeSubmit(sub._id)}
                                            disabled={isSubmittingThis}
                                            className="px-4 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
                                        >
                                            {isSubmittingThis ? 'Saving...' : isGraded ? 'Update Grade' : 'Submit Grade'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GradeSubmissions;