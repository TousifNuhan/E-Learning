import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import CoursePlayer from './CoursePlayer';
import { FiPlay, FiInbox, FiCheckCircle, FiGithub, FiClock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyEnrollClassDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons');
  const [githubLinks, setGithubLinks] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const { data: classData, isLoading } = useQuery({
    queryKey: ['enrolled-class-detail', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/enrolled-classes/${id}`);
      return res.data;
    },
  });

  const handleSubmitAssignment = async (assignmentId) => {
    const link = (githubLinks[assignmentId] || '').trim();
    if (!link) {
      toast.error('Please paste your GitHub link first.');
      return;
    }

    setSubmitting(assignmentId);
    try {
      await axiosSecure.post('/submissions', {
        assignmentId,
        classId: id,
        githubLink: link,
      });
      toast.success('Assignment submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['enrolled-class-detail', id] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment.');
    } finally {
      setSubmitting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-stone-500 min-h-[400px] flex flex-col items-center justify-center font-sans">
        <div className="animate-spin h-8 w-8 border-4 border-[#07A698] border-t-transparent rounded-full mb-2" />
        <p className="text-xs font-semibold">Loading course content...</p>
      </div>
    );
  }

  const lessons =
    classData?.lessons ||
    classData?.classDetails?.lessons ||
    classData?.course?.lessons ||
    classData?.classId?.lessons ||
    (Array.isArray(classData) ? classData : []);

  const assignments = classData?.assignments || [];
  const courseTitle =
    classData?.title ||
    classData?.classDetails?.title ||
    classData?.course?.title ||
    'Course Details';

  const currentLesson = selectedLesson || (lessons.length > 0 ? lessons[0] : null);

  const getLessonId = (lesson, idx) => lesson?.id || lesson?.lessonId || lesson?._id || idx;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 break-words">
          {courseTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'lessons'
              ? 'border-[#07A698] text-[#07A698]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Lessons
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'assignments'
              ? 'border-[#07A698] text-[#07A698]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Assignments ({assignments.length})
        </button>
      </div>

      {activeTab === 'lessons' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CoursePlayer
              classId={id}
              currentLesson={currentLesson}
              completedLessons={classData?.completedLessons || []}
            />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 h-fit">
            <h2 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">
              Course Lessons ({lessons.length})
            </h2>

            {lessons.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {lessons.map((lesson, idx) => {
                  const lessonId = getLessonId(lesson, idx);
                  const currentId = getLessonId(currentLesson, 0);
                  const isSelected = String(currentId) === String(lessonId);

                  const isDone = (classData?.completedLessons || [])
                    .map(String)
                    .includes(String(lessonId));

                  return (
                    <button
                      key={lessonId}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#07A698] text-white'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 pr-2 min-w-0">
                        {isDone ? (
                          <FiCheckCircle className="text-xs shrink-0" />
                        ) : (
                          <FiPlay className="text-xs shrink-0" />
                        )}
                        <span className="truncate">
                          {idx + 1}. {lesson.title || `Lesson ${idx + 1}`}
                        </span>
                      </div>
                      {lesson.duration && (
                        <span className="text-[11px] opacity-80 shrink-0">
                          {lesson.duration}m
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <FiInbox className="text-2xl mx-auto mb-1 text-stone-300" />
                <p className="text-xs font-medium">No lessons available for this course.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs leading-relaxed">
            <FiAlertCircle className="text-base text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Important Note:</p>
              <p className="text-amber-700">
                Please complete watching all course lessons before attempting and submitting these assignments.
              </p>
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
              No assignments have been posted for this course yet.
            </div>
          ) : (
            assignments.map((a) => {
              const sub = a.submission;
              const isGraded = sub?.status === 'graded';
              const passed = isGraded && sub.grade >= 80;

              return (
                <div key={a._id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-stone-900 text-sm break-words">{a.title}</h3>
                      <p className="text-xs text-stone-500 mt-1 break-words">{a.description}</p>
                    </div>
                    {sub && (
                      <span className={`shrink-0 self-start px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isGraded
                          ? passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isGraded ? (
                          <>{passed ? <FiCheckCircle /> : <FiAlertCircle />} Graded: {sub.grade}/100</>
                        ) : (
                          <><FiClock /> Awaiting Grade</>
                        )}
                      </span>
                    )}
                  </div>

                  {sub && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <div className="overflow-hidden">
                        <a
                          href={sub.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07A698] hover:underline max-w-full"
                        >
                          <FiGithub className="shrink-0" />
                          <span className="truncate">{sub.githubLink}</span>
                        </a>
                      </div>
                      {isGraded && sub.feedback && (
                        <p className="text-xs text-stone-600 break-words">
                          <span className="font-bold">Feedback: </span>{sub.feedback}
                        </p>
                      )}
                      {!isGraded && (
                        <p className="text-[11px] text-stone-400">
                          Submitted {new Date(sub.submittedAt).toLocaleDateString()} — you may resubmit below to replace this.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="https://github.com/username/repo"
                      value={githubLinks[a._id] || ''}
                      onChange={(e) => setGithubLinks((prev) => ({ ...prev, [a._id]: e.target.value }))}
                      className="flex-1 p-2.5 border border-stone-300 rounded-lg text-xs outline-none focus:border-[#07A698]"
                    />
                    <button
                      onClick={() => handleSubmitAssignment(a._id)}
                      disabled={submitting === a._id}
                      className="px-4 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {submitting === a._id ? 'Submitting...' : sub ? 'Resubmit' : 'Submit'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MyEnrollClassDetails;