import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import useClasses from '../../../hooks/useClasses';

const RecentCourses = () => {
    const swiperRef = useRef(null);
    const [classes = []] = useClasses();

    const filteredClasses = classes
        .filter(c => c.status === 'accepted')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    const displayCourses = filteredClasses.length > 0 ? filteredClasses : [];

    const formatPrice = (val) => {
        if (val === undefined || val === null) return '0.00';
        if (typeof val === 'number') return val.toFixed(2);
        const parsed = parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
        return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
    };

    const renderStars = (rating) => {
        const numericRating = Math.min(5, Math.max(0, parseFloat(rating) || 0));
        return [1, 2, 3, 4, 5].map((starIndex) => (
            <span
                key={starIndex}
                className={starIndex <= Math.round(numericRating) ? 'text-amber-400' : 'text-gray-300'}
            >
                ★
            </span>
        ));
    };

    return (
        <section className="bg-gray-50 py-12 md:py-20 px-4 md:px-8 font-sans overflow-hidden">
            <div className="max-w-6xl w-full mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 md:mb-10">
                    <div className="flex flex-col items-start">
                        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-slate-600 text-xs md:text-sm font-medium px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm mb-3 md:mb-4">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            New Courses
                        </span>

                        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">
                            Our Recent Courses
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-slate-600 shadow-sm hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300 active:scale-90 cursor-pointer"
                            aria-label="Previous Slide"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-slate-600 shadow-sm hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300 active:scale-90 cursor-pointer"
                            aria-label="Next Slide"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    className="w-full !py-4"
                >
                    {displayCourses.map((course, idx) => {
                        const courseId = course._id || course.id || idx;
                        const teacherImg = course.teacherImage || course.instructorImage || 'https://via.placeholder.com/100';
                        const categoryName = course.category || course.tag || 'General';
                        const instructorName = course.instructor || course.name || 'Instructor';
                        const totalLessons = course.totalLessons || course.lessons || '0';
                        const totalHours = course.totalHours || course.duration || '0';
                        const ratingVal = course.rating || '5.0';
                        const reviewsCount = course.totalReviews || 0;

                        return (
                            <SwiperSlide key={courseId} className="h-auto">
                                <Link 
                                    to={`/courseDetails/${courseId}`} 
                                    className="group bg-white h-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between cursor-pointer block"
                                >
                                    <div>
                                        <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <img
                                                        src={teacherImg}
                                                        alt={instructorName}
                                                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200"
                                                    />
                                                    <span className="text-xs font-medium text-slate-500 truncate">
                                                        {instructorName}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md shrink-0">
                                                    {categoryName}
                                                </span>
                                            </div>

                                            <h3 className="text-slate-800 text-base md:text-lg font-bold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-1 mt-3">
                                                <div className="flex gap-0.5 text-xs md:text-sm">
                                                    {renderStars(ratingVal)}
                                                </div>
                                                <span className="text-slate-400 text-xs font-medium ml-1">
                                                    {ratingVal} ({reviewsCount})
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                                </svg>
                                                {totalLessons} Lessons
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                {totalHours}h
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            {(course.originalPrice || course.oldPrice) && (
                                                <span className="text-[11px] text-slate-400 line-through block leading-none mb-0.5">
                                                    ${formatPrice(course.originalPrice || course.oldPrice)}
                                                </span>
                                            )}
                                            <span className="text-base md:text-lg font-bold text-slate-800">
                                                ${formatPrice(course.price)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

            </div>
        </section>
    );
};

export default RecentCourses;