import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MdOutlineAccessTime,
    MdOutlineMenuBook,
    MdOutlinePeople,
    MdOutlineLanguage,
    MdOutlineTune,
    MdOutlineWorkspacePremium,
    MdExpandMore,
    MdPlayCircleOutline,
    MdLockOutline,
    MdCheckCircleOutline,
    MdOutlineShare,
    MdClose,
    MdContentCopy,
    MdStar,
    MdStarBorder
} from 'react-icons/md';
import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaWhatsapp
} from 'react-icons/fa';

import { SiGmail as SiGmailIcon } from 'react-icons/si';
import { Helmet } from 'react-helmet-async';
import useClasses from '../../../hooks/useClasses';

import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useCart from '../../../hooks/useCart';
import useEnrolledClassIds from '../../../hooks/useEnrolledClassIds ';

const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;

    try {
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/shorts/')) {
            videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0];
        }
    } catch (err) {
        toast.error(err);
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
};

const ClassDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [expandedModule, setExpandedModule] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [newReview, setNewReview] = useState('');
    const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const [classes = [], loading] = useClasses();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [, refetch] = useCart();

    const [enrolledIds] = useEnrolledClassIds();
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [relatedCourses, setRelatedCourses] = useState([]);

    const ratingBreakdown = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            const rating = Math.round(Number(r.rating) || 0);
            if (counts[rating] !== undefined) counts[rating]++;
        });
        const total = reviews.length;
        return [5, 4, 3, 2, 1].map(stars => ({
            stars,
            pct: total > 0 ? Math.round((counts[stars] / total) * 100) : 0
        }));
    }, [reviews]);

    const course = classes.find(c => (c._id || c.id) === id);

    const liveAvgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length)
        : Number(course?.rating) || 0;

    const courseId = course?._id || course?.id;
    const isEnrolled = !!user && enrolledIds.includes(courseId?.toString());
    const hasReviewed = reviews.some(r => r.userEmail === user?.email);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!courseId) return;
        setReviewsLoading(true);
        axiosSecure.get(`/reviews/class/${courseId}`)
            .then(res => setReviews(res.data || []))
            .catch(err => {
                toast.error('Failed to load reviews', err);
            })
            .finally(() => setReviewsLoading(false));
    }, [courseId, axiosSecure]);

    useEffect(() => {
        if (!courseId) return;
        axiosSecure.get(`/classes/${courseId}/related`)
            .then(res => setRelatedCourses(res.data || []))
            .catch(err => {
                toast.error('Failed to load related courses:', err);
            });
    }, [courseId, axiosSecure]);

    useEffect(() => {
        if (!loading && course && window.location.hash === '#reviews') {
            setActiveTab('reviews');
            setTimeout(() => {
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [loading, course]);

    const handleBuyNow = () => {
        if (!user) {
            toast.error('Please login to purchase this course');
            return navigate('/login');
        }

        const price = Number(course.price) || 0;

        navigate('/dashboard/payment', {
            state: {
                items: [{
                    _id: course._id || course.id,
                    classId: course._id || course.id,
                    title: course.title,
                    price: price,
                    image: course.image,
                    teacherEmail: course.email || course.teacherEmail
                }],
                totalAmount: price,
                isDirectPurchase: true
            }
        });
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return navigate('/login');
        }

        const cartItem = {
            courseId: course._id || course.id,
            title: course.title,
            price: Number(course.price) || 0,
            originalPrice: Number(course.originalPrice) || 0,
            image: course.image,
            category: course.category,
            language: course.language,
            duration: course.duration,
            skillLevel: course.skillLevel,
            instructor: {
                id: course.teacherId,
                name: course.teacherName || course.name,
                email: course.email,
                image: course.teacherImage,
                title: course.instructorDetails?.title,
                bio: course.instructorDetails?.bio
            },
            stats: {
                totalEnrollment: course.totalEnrollment,
                totalReviews: course.totalReviews,
                totalAssignments: course.totalAssignments,
                totalLessons: course.totalLessons,
                totalHours: course.totalHours,
                rating: course.rating
            },
            userEmail: user?.email,
            addedAt: new Date().toISOString()
        };

        axiosSecure.post('/carts', cartItem)
            .then(res => {
                if (res?.data?.insertedId) {
                    toast.success('Course added to cart successfully!');
                    refetch();
                }
            });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to leave a review');
            return navigate('/login');
        }
        if (userRating === 0) {
            toast.error('Please select a star rating');
            return;
        }
        try {
            setIsSubmittingReview(true);
            const res = await axiosSecure.post('/reviews', {
                classId: courseId,
                rating: userRating,
                comment: newReview
            });
            if (res?.data?.success) {
                toast.success('Review submitted successfully!');
                setNewReview('');
                setUserRating(0);
                setReviews(prev => [
                    { userEmail: user.email, userName: user.displayName || 'You', rating: userRating, comment: newReview, createdAt: new Date() },
                    ...prev
                ]);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            toast.success('Course link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(course?.title || 'Check out this course!');

    const socialPlatforms = [
        {
            name: 'Facebook',
            icon: FaFacebookF,
            bgColor: 'bg-[#1877F2]/10 hover:bg-[#1877F2]',
            textColor: 'text-[#1877F2] hover:text-white',
            link: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        },
        {
            name: 'X (Twitter)',
            icon: FaTwitter,
            bgColor: 'bg-[#1877F2]/10 hover:bg-stone-900',
            textColor: 'text-stone-[#1877F2] hover:text-white',
            link: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            bgColor: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]',
            textColor: 'text-[#0A66C2] hover:text-white',
            link: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            bgColor: 'bg-[#25D366]/10 hover:bg-[#25D366]',
            textColor: 'text-[#25D366] hover:text-white',
            link: `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`
        },
        {
            name: 'Gmail',
            icon: SiGmailIcon,
            bgColor: 'bg-stone-100 hover:bg-[#EA4335]',
            textColor: 'text-[#EA4335] hover:text-white',
            link: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${shareTitle}&body=${shareUrl}`
        }
    ];

    const getCoursePreviewUrl = (courseObj) => {
        if (courseObj?.previewVideoUrl) {
            return courseObj.previewVideoUrl;
        }
        if (courseObj?.modules && courseObj.modules.length > 0) {
            for (const mod of courseObj.modules) {
                const freeLesson = mod.lessons?.find(l => l.isFree && l.videoUrl);
                if (freeLesson) return freeLesson.videoUrl;
            }
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center space-y-4">
                <div className="h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-stone-500 uppercase tracking-widest">
                    Loading course platform...
                </p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center text-center px-4 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Course Not Found</h2>
                    <p className="text-sm text-stone-600 max-w-md leading-relaxed">
                        The course you are looking for is unavailable or has been removed.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer"
                >
                    Back to All Courses
                </button>
            </div>
        );
    }

    const scrollToSection = (tabId) => {
        setActiveTab(tabId);
        const element = document.getElementById(tabId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderStars = (rating = 5) => {
        const numericRating = Math.round(Number(rating) || 5);
        return Array.from({ length: 5 }, (_, i) =>
            i < numericRating ? <MdStar key={i} /> : <MdStarBorder key={i} />
        );
    };

    const embedUrl = getYouTubeEmbedUrl(selectedVideoUrl);

    return (
        <div className="bg-[#F8F9FB] pt-28 min-h-screen text-stone-800 font-sans antialiased relative">
            <Helmet>
                <title>{`EdCare | ${course.title || 'Course Details'}`}</title>
            </Helmet>

            <header className="bg-white border-b border-stone-200/80 pt-8 pb-6 px-4 md:px-12">
                <div className="max-w-7xl mx-auto space-y-3">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-sans font-extrabold text-[#2F2D51] tracking-tight leading-tight">
                        {course.title}
                    </h1>

                    <p className="text-sm md:text-base text-[#77838F] max-w-3xl leading-relaxed font-sans font-medium">
                        {course.shortDescription || course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-10 pt-3 text-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-1 rounded-full border border-stone-200/80 bg-white shadow-sm">
                                <img
                                    src={course.teacherImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                                    alt="Instructor"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[#2F2D51] block text-sm font-bold tracking-tight">Created by</span>
                                <span className="text-[#64748B] text-sm font-normal block">{course.teacherName || course.name || 'Alison Dawn'}</span>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <span className="text-[#2F2D51] block text-sm font-bold tracking-tight">Categories</span>
                            <span className="text-[#64748B] text-sm font-normal block">{course.category || 'Design'}</span>
                        </div>

                        <div className="space-y-0.5">
                            <span className="text-[#2F2D51] block text-sm font-bold tracking-tight">Review</span>
                            <div className="flex items-center gap-2">
                                <div className="flex text-[#FBBF24] text-base gap-0.5">
                                    {renderStars(liveAvgRating)}
                                </div>
                                <span className="text-[#64748B] text-sm font-normal">
                                    {liveAvgRating.toFixed(1)} ({reviews.length} reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-8 space-y-8">

                    <nav className="sticky top-0 z-20 bg-white border border-stone-200 rounded-lg shadow-sm flex overflow-x-auto">
                        {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => scrollToSection(tab)}
                                className={`flex-1 py-3.5 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer ${activeTab === tab
                                    ? 'border-[#07A698] text-[#07A698] bg-[#07A698]/5'
                                    : 'border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>

                    <section id="overview" className="bg-white border border-stone-200/80 rounded-xl p-6 md:p-8 space-y-6">
                        <h2 className="text-base md:text-xl font-bold text-stone-900 border-b border-stone-100 tracking-tight">
                            Course Description
                        </h2>
                        <p className="text-sm text-stone-600 leading-relaxed font-medium">
                            {course.description}
                        </p>

                        {course.objectives && course.objectives.length > 0 && (
                            <div className="pt-2">
                                <h3 className="text-sm md:text-xl font-bold text-stone-900 mb-4 tracking-tight">What You'll Learn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {course.objectives.map((item, idx) => (
                                        <div key={idx} className="flex gap-2.5 items-start text-sm text-stone-700 leading-snug">
                                            <MdCheckCircleOutline className="text-[#07A698] text-lg shrink-0 mt-0.5" />
                                            <span className='font-medium'>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {course.requirements && course.requirements.length > 0 && (
                            <div className="pt-4 border-t border-stone-100">
                                <h3 className="text-sm md:text-xl font-bold text-stone-900 mb-2.5 tracking-tight">Requirements</h3>
                                <ul className="list-inside list-none space-y-2 text-sm text-stone-600 leading-relaxed">
                                    {course.requirements.map((req, idx) => (
                                        <li key={idx} className="list-disc marker:text-[#07A698] font-medium">{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section id="curriculum" className="bg-white border border-stone-200/80 rounded-xl p-6 md:p-8 space-y-6">
                        <div className="flex justify-between items-center border-b pb-3 border-stone-100">
                            <h2 className="text-base md:text-xl font-bold text-stone-900 tracking-tight">Curriculum</h2>
                            <span className="text-xs text-stone-500 font-semibold tracking-wide">
                                {course.totalLessons || 0} Lessons • {course.totalHours || 0} Hours Total
                            </span>
                        </div>

                        <div className="space-y-3">
                            {course.modules && course.modules.length > 0 ? (
                                course.modules.map((mod, mIdx) => (
                                    <div key={mIdx} className="border border-stone-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedModule(expandedModule === mIdx ? -1 : mIdx)}
                                            className="w-full bg-stone-50 p-4 flex justify-between items-center text-left text-sm font-bold text-stone-900 hover:bg-stone-100/80 transition-colors cursor-pointer"
                                        >
                                            <span>{mod.title}</span>
                                            <MdExpandMore className={`text-xl text-stone-500 transition-transform ${expandedModule === mIdx ? 'rotate-180' : ''}`} />
                                        </button>

                                        {expandedModule === mIdx && (
                                            <div className="divide-y divide-stone-100 bg-white">
                                                {mod.lessons && mod.lessons.map((lesson, lIdx) => (
                                                    <div
                                                        key={lesson.id || lesson._id || lIdx}
                                                        onClick={() => {
                                                            if (lesson.isFree) {
                                                                if (lesson.videoUrl) {
                                                                    setSelectedVideoUrl(lesson.videoUrl);
                                                                } else {
                                                                    alert("YouTube video URL not found for this lesson.");
                                                                }
                                                            }
                                                        }}
                                                        className={`p-3.5 px-4 flex justify-between items-center text-xs md:text-sm ${lesson.isFree
                                                            ? 'cursor-pointer hover:bg-stone-50 transition-colors'
                                                            : 'opacity-75 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 text-stone-700 font-medium">
                                                            <MdPlayCircleOutline className={`text-lg shrink-0 ${lesson.isFree ? 'text-[#07A698]' : 'text-stone-400'}`} />
                                                            <span>{lesson.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {lesson.isFree ? (
                                                                <span className="bg-[#07A698]/10 text-[#07A698] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">Preview</span>
                                                            ) : (
                                                                <MdLockOutline className="text-stone-400 text-base" />
                                                            )}
                                                            <span className="text-stone-500 font-mono text-xs">{lesson.duration}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-stone-500">No modules available for this course.</p>
                            )}
                        </div>
                    </section>

                    <section id="instructor" className="bg-white border border-stone-200/80 rounded-xl p-6 md:p-8 space-y-4">
                        <h2 className="text-base md:text-xl font-bold text-stone-900 border-b pb-3 border-stone-100 tracking-tight">About the Instructor</h2>
                        <div className="flex gap-4 items-start pt-1">
                            <img
                                src={course.teacherImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                                alt="Instructor"
                                className="w-16 h-16 rounded-full object-cover border border-stone-200 shrink-0"
                            />
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-stone-900">{course.name || course.teacherName || 'Instructor'}</h3>
                                <p className="text-xs text-[#07A698] font-semibold tracking-wide">
                                    {course.instructorDetails?.title || 'Senior Software Engineer & Lecturer'}
                                </p>
                                <p className="text-xs md:text-sm text-stone-600 leading-relaxed pt-1.5">
                                    {course.instructorDetails?.bio || 'Experienced educator with strong background in modern software engineering and Web development.'}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="reviews" className="bg-white border border-stone-200/80 rounded-xl p-6 md:p-8 space-y-6">
                        <h2 className="text-base md:text-xl font-bold text-stone-900 border-b pb-3 border-stone-100 tracking-tight">Student Feedback</h2>

                        <div className="flex flex-col sm:flex-row items-center gap-8 bg-stone-50 p-6 rounded-xl border border-stone-100">
                            <div className="text-center space-y-1">
                                <div className="text-4xl font-extrabold text-stone-900 leading-none">{liveAvgRating.toFixed(1)}</div>
                                <div className="flex text-amber-400 text-sm justify-center py-1">
                                    {renderStars(liveAvgRating)}
                                </div>
                                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Course Rating</span>
                            </div>

                            <div className="flex-1 w-full space-y-2 text-xs text-stone-600">
                                {ratingBreakdown.map((row, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-12 font-medium text-stone-700">{row.stars} Stars</span>
                                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                                        </div>
                                        <span className="w-8 text-right font-mono text-xs font-medium text-stone-500">{row.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            {reviewsLoading ? (
                                <p className="text-xs text-stone-400">Loading student reviews...</p>
                            ) : reviews.length > 0 ? (
                                reviews.map((rev, idx) => (
                                    <div key={rev._id || idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm text-stone-800">{rev.userName || rev.userEmail}</span>
                                            <div className="flex text-amber-400 text-xs gap-0.5">
                                                {renderStars(rev.rating)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-stone-400">No reviews yet for this course.</p>
                            )}
                        </div>

                        <div className="pt-6 border-t border-stone-100 space-y-4">
                            {!user ? (
                                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center space-y-2">
                                    <p className="text-sm font-semibold text-stone-700">Log in to leave a review</p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-xs font-bold text-[#07A698] hover:text-[#05857a] underline underline-offset-4 cursor-pointer"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            ) : !isEnrolled ? (
                                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center space-y-1">
                                    <p className="text-sm font-semibold text-stone-700">Enroll in this course to share your review</p>
                                    <p className="text-xs text-stone-500">Only students who've purchased this course can leave feedback.</p>
                                </div>
                            ) : hasReviewed ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 text-center">
                                    <p className="text-sm font-semibold text-emerald-700">You've already reviewed this course. Thank you!</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-stone-900 tracking-tight">Add Review & Rating</h3>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div className="flex text-stone-300 text-xl gap-1 cursor-pointer">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <MdStar
                                                    key={star}
                                                    onClick={() => setUserRating(star)}
                                                    className={`transition-colors ${star <= userRating ? 'text-amber-400' : 'hover:text-amber-400'}`}
                                                />
                                            ))}
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            placeholder="Write your review comments here..."
                                            className="w-full text-xs md:text-sm text-stone-800 placeholder:text-stone-400 p-3.5 border border-stone-200 rounded-lg focus:outline-none focus:border-[#07A698] focus:ring-1 focus:ring-[#07A698]"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview}
                                            className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </section>

                </div>

                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-sm space-y-5 p-5">
                        <div
                            onClick={() => {
                                const previewUrl = course?.previewVideoUrl || getCoursePreviewUrl(course);
                                if (previewUrl) {
                                    setSelectedVideoUrl(previewUrl);
                                } else {
                                    alert("No preview video available for this course.");
                                }
                            }}
                            className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                        >
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                <MdPlayCircleOutline className="text-white text-5xl opacity-90 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>

                        <div className="flex items-baseline justify-between">
                            <div className="space-x-2">
                                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
                                    ৳{Number(course.price) === 0 || !course.price ? "0.00" : Number(course.price).toFixed(2)}
                                </span>
                                {course.originalPrice && (
                                    <span className="text-xs text-stone-400 font-medium line-through">
                                        ৳{Number(course.originalPrice).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold bg-[#07A698]/10 text-[#07A698] px-2 py-1 rounded uppercase tracking-wider">
                                {Number(course.price) === 0 || !course.price ? "Free Access" : "Premium"}
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {isEnrolled ? (
                                <button
                                    onClick={() => navigate(`/dashboard/myenroll-class/${courseId}`)}
                                    className="w-full py-3 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                                >
                                    <MdPlayCircleOutline className="text-base" />
                                    Continue Learning
                                </button>
                            ) : course?.instructorStatus === 'deactivated' ? (
                                <div className="w-full py-3.5 px-4 bg-stone-100 border border-stone-200 rounded-xl text-center space-y-1">
                                    <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">Enrollment Closed</p>
                                    <p className="text-[11px] text-stone-400 font-medium">This instructor's account is currently inactive.</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full py-3 bg-[#000052] hover:bg-[#000033] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                                    >
                                        BUY NOW
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full py-3 bg-[#FFC58D] hover:bg-[#ffb773] text-stone-900 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                                    >
                                        ADD TO CART
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="pt-2 divide-y divide-stone-100 text-xs">
                            <div className="py-2.5 flex justify-between">
                                <span className="flex items-center gap-2 text-stone-500 font-medium">
                                    <MdOutlineAccessTime className="text-stone-400 text-base" /> Duration
                                </span>
                                <span className="font-semibold text-stone-900">{course.duration || `${course.totalHours || '0'} hours`}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="flex items-center gap-2 text-stone-500 font-medium">
                                    <MdOutlineMenuBook className="text-stone-400 text-base" /> Lectures
                                </span>
                                <span className="font-semibold text-stone-900">{course.totalLessons || 0}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="flex items-center gap-2 text-stone-500 font-medium">
                                    <MdOutlinePeople className="text-stone-400 text-base" /> Enrolled
                                </span>
                                <span className="font-semibold text-stone-900">{(course.totalEnrollment || 0).toLocaleString()} students</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="flex items-center gap-2 text-stone-500 font-medium">
                                    <MdOutlineLanguage className="text-stone-400 text-base" /> Language
                                </span>
                                <span className="font-semibold text-stone-900">{course.language || 'English'}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="flex items-center gap-2 text-stone-500 font-medium">
                                    <MdOutlineTune className="text-[#07A698] text-base" /> Skill level
                                </span>
                                <span className="font-semibold text-stone-900 capitalize">{course.skillLevel || 'Beginner'}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="flex items-center gap-2 text-stone-500 font-medium">
                                    <MdOutlineWorkspacePremium className="text-stone-400 text-base" /> Certificate
                                </span>
                                <span className="font-semibold text-stone-900">{course.certificate || 'Yes'}</span>
                            </div>
                        </div>

                        <div className="pt-2 text-center border-t border-stone-100">
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer"
                            >
                                <MdOutlineShare className="text-sm" /> Share this course
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            <section className="bg-gradient-to-b from-[#F8F9FB] to-stone-50 border-t border-stone-200/70 py-16 px-4 md:px-12 mt-12">
                <div className="max-w-7xl mx-auto space-y-10">

                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <h2 className="text-xl md:text-3xl font-semibold text-[#2F2D51] tracking-tight font-sans">
                            Related Courses
                        </h2>
                        <p className="pt-1 text-lg md:text-md text-[#77838F] font-medium font-sans">
                            Discover Your Perfect Program In Our Courses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedCourses.map((item, idx) => (
                            <div
                                key={item._id || item.id || idx}
                                onClick={() => navigate(`/courseDetails/${item._id || item.id}`)}
                                className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-stone-100">
                                            <span className="text-xs font-extrabold text-stone-900">
                                                {Number(item.price) === 0 || !item.price ? "Free" : `৳${Number(item.price).toFixed(2)}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-3">
                                        <span className="text-[11px] font-semibold text-stone-400 block tracking-wide">
                                            {item.category || 'Development'}
                                        </span>

                                        <h3 className="font-bold text-sm md:text-base text-[#23263B] group-hover:text-[#07A698] transition-colors leading-snug line-clamp-2 min-h-[2.6rem]">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#1877F2]">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <MdOutlineMenuBook className="text-stone-400 text-sm" />
                                        <span>{item.totalLessons || 5} lessons</span>
                                    </div>

                                    <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                                        {renderStars(item.rating || 5)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {isShareModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-100 space-y-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900">Share Course</h3>
                                <p className="text-xs text-stone-500">Spread the word with your network</p>
                            </div>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                            >
                                <MdClose className="text-lg" />
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {socialPlatforms.map((platform) => {
                                const Icon = platform.icon;
                                return (
                                    <a
                                        key={platform.name}
                                        href={platform.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-2 group cursor-pointer"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${platform.bgColor} ${platform.textColor}`}>
                                            <Icon className="text-lg" />
                                        </div>
                                        <span className="text-[11px] font-medium text-stone-600 group-hover:text-stone-900">
                                            {platform.name}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-stone-700 block">Copy Link</label>
                            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl p-1.5">
                                <input
                                    type="text"
                                    readOnly
                                    value={window.location.href}
                                    className="w-full bg-transparent text-xs text-stone-600 px-2 outline-none font-mono truncate"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${isCopied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#07A698] hover:bg-[#05857a] text-white'
                                        }`}
                                >
                                    {isCopied ? (
                                        <>
                                            <MdCheckCircleOutline className="text-sm" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <MdContentCopy className="text-sm" /> Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedVideoUrl && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={() => setSelectedVideoUrl(null)}
                            className="absolute top-3 right-3 z-10 p-2 bg-stone-900/80 hover:bg-stone-800 text-white rounded-full transition-colors cursor-pointer"
                        >
                            <MdClose className="text-xl" />
                        </button>

                        <div className="relative pt-[56.25%] bg-black">
                            {embedUrl ? (
                                <iframe
                                    key={embedUrl}
                                    src={embedUrl}
                                    title="Course YouTube Lesson"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
                                    Invalid YouTube URL format.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetails;