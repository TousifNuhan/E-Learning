import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';
import { FiCheckCircle, FiPlayCircle } from 'react-icons/fi';

const CoursePlayer = ({
  classId,
  currentLesson,
  completedLessons = [],
  onLessonCompleted,
  progressPercent = 0
}) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetLessonId = currentLesson?.id || currentLesson?.lessonId || currentLesson?._id;
  const rawVideoUrl = currentLesson?.videoUrl || '';

  const showReviewNudge = progressPercent >= 100;

  const isCompleted = targetLessonId
    ? completedLessons.map(String).includes(String(targetLessonId))
    : false;

  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;

    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|&v=)([^#&?]*)/);
    if (match && match[1]?.length === 11) {
      return `https://www.youtube.com/embed/${match[1]}?enablejsapi=1`;
    }
    return url;
  };

  const handleMarkAsCompleted = async () => {
    if (!classId || !targetLessonId || isSubmitting || isCompleted) return;

    try {
      setIsSubmitting(true);

      await axiosSecure.patch('/enrolled-classes/complete-lesson', {
        classId: classId.toString(),
        lessonId: targetLessonId.toString()
      });

      queryClient.invalidateQueries({ queryKey: ['my-enrolled-classes'] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-class-detail', classId.toString()] });

      if (onLessonCompleted) {
        onLessonCompleted(targetLessonId);
      }
    } catch (error) {
      // Handled silently
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentLesson) {
    return (
      <div className="space-y-4 font-sans">
        <div className="w-full h-80 bg-stone-900 rounded-2xl flex flex-col items-center justify-center text-stone-400 p-6 text-center border border-stone-800">
          <FiPlayCircle className="text-4xl mb-2 text-stone-600 shrink-0" />
          <p className="text-sm font-semibold break-words">
            Select a lesson from the course outline to start watching.
          </p>
        </div>

        {showReviewNudge && (
          <div className="p-4 bg-[#07A698]/10 border border-[#07A698]/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-stone-900 break-words">🎉 You've completed this course!</p>
              <p className="text-xs text-stone-600 mt-0.5 break-words">Help other students by sharing your experience.</p>
            </div>
            <Link
              to={`/courseDetails/${classId}#reviews`}
              className="shrink-0 px-4 py-2 bg-[#07A698] hover:bg-[#05857a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              Leave a Review
            </Link>
          </div>
        )}
      </div>
    );
  }

  const isYouTube = isYouTubeUrl(rawVideoUrl);

  return (
    <div className="space-y-4 font-sans">
      <div className="w-full bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-800">
        <div className="relative aspect-video w-full bg-black">
          {isYouTube ? (
            <iframe
              title={currentLesson.title || 'Lesson Video'}
              src={getEmbedUrl(rawVideoUrl)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={rawVideoUrl}
              controls
              onEnded={handleMarkAsCompleted}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-4 bg-stone-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white tracking-tight break-words">
              {currentLesson.title || 'Untitled Lesson'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Duration: <span className="font-medium text-stone-300">{currentLesson.duration || 0} mins</span>
            </p>
          </div>

          <button
            onClick={handleMarkAsCompleted}
            disabled={isSubmitting || isCompleted}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                : 'bg-[#07A698] hover:bg-[#05857a] text-white shadow-xs'
            }`}
          >
            <FiCheckCircle className="text-sm shrink-0" />
            <span>{isSubmitting ? 'Updating...' : isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {showReviewNudge && (
        <div className="p-4 bg-[#07A698]/10 border border-[#07A698]/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-stone-900 break-words">🎉 You've completed this course!</p>
            <p className="text-xs text-stone-600 mt-0.5 break-words">Help other students by sharing your experience.</p>
          </div>
          <Link
            to={`/courseDetails/${classId}#reviews`}
            className="shrink-0 px-4 py-2 bg-[#07A698] hover:bg-[#05857a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            Leave a Review
          </Link>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;