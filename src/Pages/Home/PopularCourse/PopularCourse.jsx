import React from 'react';
import { Link } from 'react-router-dom';
import useClasses from '../../../hooks/useClasses';

const PopularCourse = () => {
    // 1. Default state set to 'All'
    const [classes] = useClasses()
    const popularCourses = classes
        .filter(c => c.status === 'accepted')
        .sort((a, b) => b.rating !== a.rating ? b.rating - a.rating : b.totalEnrollment - a.totalEnrollment)
        .slice(0, 6);

    // Helper function to format numbers as currency (e.g., 10 -> $10.00)
    const formatPrice = (price) => {
        if (price === undefined || price === null || price === '') return '';
        const num = parseFloat(price);
        if (isNaN(num)) return price; // If it's already a formatted string (e.g., "$10.00"), return as-is
        return `$${num.toFixed(2)}`;
    };

    return (
        <div>
            {/* Adjusted padding for mobile vs tablet/desktop */}
            <section className="relative overflow-hidden bg-[#f4f7fa] py-10 md:py-16 px-4 md:px-8 font-sans">
                
                {/* Scaled down the background glow circles for mobile so they don't stretch the screen */}
                <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-100/40 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 right-1/4 translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-green-100/40 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/50 p-4 md:p-8 lg:p-12">

                    {/* Upper Header */}
                    <div className="text-center mb-8 md:mb-10 flex flex-col items-center">
                        <span className="inline-flex items-center gap-1.5 md:gap-2 bg-[#f8f9fa] border border-gray-200 text-[#495057] text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm">
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Top Popular Course
                        </span>

                        {/* Scaled text size for mobile */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#081829] tracking-tight mt-4 md:mt-6 mb-2 leading-tight md:leading-normal">
                            All The Skills You Need In One Place
                        </h2>
                    </div>

                    {/* Course Grid Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 pt-2 md:pt-5">
                        {popularCourses.map((course) => (
                            <Link to={`/courseDetails/${course._id}`} key={course.id}>
                                <div className="bg-white cursor-pointer rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-500 hover:-translate-y-2 flex flex-col group h-full">
                                    
                                    {/* Thumbnail */}
                                    <div className="relative overflow-hidden aspect-[4/3] bg-gray-100 shrink-0">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Meta Information - Adjusted padding for mobile */}
                                    <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <img
                                                    src={course.teacherImage}
                                                    alt={course.name}
                                                    className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
                                                />
                                                <span className="text-[11px] md:text-xs font-medium text-gray-500 truncate">
                                                    by {course.name}
                                                </span>
                                            </div>

                                            <h3 className="text-base md:text-lg font-bold text-[#0c2340] leading-snug line-clamp-2 mb-3 md:mb-4 group-hover:text-[#9B5100] transition-colors">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-3 md:gap-4 text-[11px] md:text-xs font-medium text-gray-500 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-gray-100">
                                                <div className="flex items-center gap-1 md:gap-1.5">
                                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13c1.168-.766 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.766-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    {course.totalLessons} Lessons
                                                </div>
                                                <div className="flex items-center gap-1 md:gap-1.5">
                                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {course.totalHours} Hours
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ratings & Pricing */}
                                        <div className="flex items-center justify-between mt-auto pt-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-bold text-[#0c2340]">{course.rating}</span>
                                                <span className="text-amber-400 text-xs">★</span>
                                                <span className="text-[11px] md:text-xs text-gray-400">({course.totalReviews})</span>
                                            </div>

                                            <div className="flex items-baseline gap-1.5 md:gap-2">
                                                {course.originalPrice && (
                                                    <span className="text-[11px] md:text-xs text-gray-400 line-through font-medium">
                                                        {formatPrice(course.originalPrice)}
                                                    </span>
                                                )}
                                                <span className="text-base md:text-lg font-extrabold text-[#c46807]">
                                                    {formatPrice(course.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* "See More Courses" Link - Scaled down padding on mobile */}
                    <div className="flex justify-center mt-8 md:mt-12 pb-2 md:pb-5">
                        <Link to="/allCourses">
                            <button className="flex items-center gap-2 bg-[#c46807] hover:bg-[#a35404] text-white text-sm md:text-base font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer">
                                See More Courses
                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </Link>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default PopularCourse;