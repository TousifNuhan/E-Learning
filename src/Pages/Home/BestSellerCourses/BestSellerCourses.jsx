import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useClasses from '../../../hooks/useClasses';

const BestSellerCourses = () => {
    const navigate = useNavigate();

    // 1. Fetch real courses from custom hook
    const [classes = []] = useClasses();

    // Helper function to normalize category strings for comparison
    const normalizeStr = (str = '') => str.toLowerCase().replace(/[\s\-_]/g, '');

    // Helper function to render clean label display
    const formatCategoryLabel = (cat = '') => {
        const normalized = normalizeStr(cat);
        if (normalized === 'ai') return 'AI';
        if (normalized === 'webdevelopment') return 'Web Development';
        if (normalized === 'mobiledevelopment') return 'Mobile Development';

        const spaced = cat.replace(/([a-z])([A-Z])/g, '$1 $2');
        return spaced
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // 2. DYNAMICALLY CALCULATE TOP 3 CATEGORIES BY TOTAL ENROLLMENT
    const categories = useMemo(() => {
        const categoryEnrollments = {};

        classes.forEach((c) => {
            if (c.status === 'accepted' && c.category) {
                const rawCategory = c.category.trim();
                const enrollment = Number(c.totalEnrollment) || 0;

                categoryEnrollments[rawCategory] = (categoryEnrollments[rawCategory] || 0) + enrollment;
            }
        });

        return Object.keys(categoryEnrollments)
            .sort((a, b) => categoryEnrollments[b] - categoryEnrollments[a])
            .slice(0, 3);
    }, [classes]);

    // 3. Active Tab State
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {
        if (categories.length > 0 && !categories.includes(activeCategory)) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    // Helper function for safe navigation to details page
    const handleCourseClick = (course) => {
        const targetId = course._id || course.id;
        if (targetId) {
            navigate(`/courseDetails/${targetId}`);
        }
    };

    // --- NUMBER FORMATTING HELPERS ---
    const formatPrice = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    const formatRating = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? '5.0' : num.toFixed(1);
    };

    // 4. Filter by accepted status + normalized category, SORT by totalEnrollment -> rating
    const bestSelling = useMemo(() => {
        if (!activeCategory) return [];

        return classes
            .filter(c => {
                const isAccepted = c.status === 'accepted';
                const courseCategory = normalizeStr(c.category);
                const targetCategory = normalizeStr(activeCategory);
                
                return isAccepted && courseCategory === targetCategory;
            })
            .sort((a, b) => {
                const enrollmentDiff = (Number(b.totalEnrollment) || 0) - (Number(a.totalEnrollment) || 0);
                if (enrollmentDiff !== 0) return enrollmentDiff;

                return (Number(b.rating) || 0) - (Number(a.rating) || 0);
            });
    }, [classes, activeCategory]);

    // 5. Hero Course (#1 ranked item)
    const heroCourse = bestSelling[0];

    // 6. Remaining Top Courses (Capped at maximum 3 items for the right side)
    const standardCourses = bestSelling.slice(1, 4);

    return (
        <section className="bg-[#f4f7fa] py-16 md:py-20 px-4 md:px-8 font-sans overflow-hidden">
            {/* FIXED: Removed mx-5 and adjusted mobile padding to prevent horizontal scroll issues */}
            <div className="max-w-7xl mx-auto">
                
                {/* Header Layout */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-5 md:gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 text-[#a65100] text-[11px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg mb-3 md:mb-4">
                            🔥 Top Ranked Tracks
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0c1e33] tracking-tight">
                            Our Best Selling Courses
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm md:text-base max-w-xl">
                            Explore top-rated curricula ranked by enrollment volume and student satisfaction.
                        </p>
                    </div>

                    {/* Category Selector */}
                    {categories.length > 0 && (
                        <div className="flex bg-white p-1.5 rounded-xl border border-gray-200/50 shadow-sm self-start md:self-auto overflow-x-auto max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                                        activeCategory === cat
                                            ? 'bg-[#0c1e33] text-white shadow-md'
                                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}
                                >
                                    {formatCategoryLabel(cat)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Stage */}
                {bestSelling.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                        
                        {/* LEFT STAGE: Hero Focal Highlight Card */}
                        {heroCourse && (
                            <div 
                                onClick={() => handleCourseClick(heroCourse)}
                                className="lg:col-span-5 group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full"
                            >
                                <div className="relative overflow-hidden aspect-[4/3] w-full">
                                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow">
                                        #1 Best Seller
                                    </div>
                                    <img 
                                        src={heroCourse.image} 
                                        alt={heroCourse.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="p-5 md:p-8 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            {heroCourse.teacherImage && (
                                                <img 
                                                    src={heroCourse.teacherImage} 
                                                    alt={heroCourse.name} 
                                                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border-2 border-amber-100" 
                                                />
                                            )}
                                            <span className="text-[11px] md:text-xs font-semibold text-gray-600">
                                                By {heroCourse.name || heroCourse.teacherName || 'Instructor'}
                                            </span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                                {formatCategoryLabel(heroCourse.category)}
                                            </span>
                                        </div>

                                        <h3 className="text-lg md:text-2xl font-extrabold text-[#0c1e33] leading-tight mb-3 group-hover:text-amber-700 transition-colors">
                                            {heroCourse.title}
                                        </h3>
                                        
                                        <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3 md:line-clamp-4">
                                            {heroCourse.shortDescription || heroCourse.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                                                <span className="text-xs md:text-sm font-bold text-amber-700">
                                                    {formatRating(heroCourse.rating)}
                                                </span>
                                                <span className="text-amber-500 text-[10px] md:text-xs">★</span>
                                            </div>
                                            <span className="text-[11px] md:text-xs font-medium text-gray-400">
                                                ({heroCourse.totalEnrollment || 0} enrolled)
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            {heroCourse.originalPrice && (
                                                <span className="text-[10px] md:text-xs text-gray-400 line-through block font-medium">
                                                    ${formatPrice(heroCourse.originalPrice)}
                                                </span>
                                            )}
                                            <span className="text-lg md:text-xl font-black text-emerald-600">
                                                ${formatPrice(heroCourse.price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* RIGHT STAGE: Standard Course Stack (Max 3 items) */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            {standardCourses.length > 0 ? (
                                standardCourses.map((course, idx) => (
                                    <React.Fragment key={course._id || course.id || idx}>
                                        {/* FIXED: Removed sm: breakpoints and mapped purely to mobile-first and md: */}
                                        <div 
                                            onClick={() => handleCourseClick(course)}
                                            className="group bg-white rounded-2xl border border-gray-100 p-3.5 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5 items-center shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer w-full"
                                        >
                                            {/* FIXED: Simplified aspect ratio logic */}
                                            <div className="relative w-full md:w-44 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                                <img 
                                                    src={course.image} 
                                                    alt={course.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-2 left-2 bg-[#0c1e33] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded shadow">
                                                    #{idx + 2} Top Rank
                                                </div>
                                            </div>

                                            <div className="flex-grow w-full flex flex-col justify-between h-full py-0.5">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {course.teacherImage && (
                                                            <img 
                                                                src={course.teacherImage} 
                                                                alt={course.name} 
                                                                className="w-5 h-5 rounded-full object-cover" 
                                                            />
                                                        )}
                                                        <span className="text-[10px] md:text-[11px] font-medium text-gray-500">
                                                            {course.name || course.teacherName || 'Instructor'}
                                                        </span>
                                                        <span className="text-gray-300 text-[10px] md:text-xs">•</span>
                                                        <span className="text-[10px] md:text-[11px] font-bold text-gray-600">
                                                            {formatCategoryLabel(course.category)}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-sm md:text-base font-bold text-[#0c1e33] leading-snug mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
                                                        {course.title}
                                                    </h4>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="flex items-center gap-0.5 text-[11px] md:text-xs font-bold text-amber-600">
                                                            <span>{formatRating(course.rating)}</span>
                                                            <span>★</span>
                                                        </div>
                                                        <span className="text-[10px] md:text-[11px] font-semibold text-gray-400">
                                                            {course.totalEnrollment || 0} enrolled
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        {course.originalPrice && (
                                                            <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                                                                ${formatPrice(course.originalPrice)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm md:text-base font-extrabold text-emerald-600">
                                                            ${formatPrice(course.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 h-full flex items-center justify-center">
                                    <p className="text-sm font-medium">No additional best sellers in {formatCategoryLabel(activeCategory)}.</p>
                                </div>
                            )}
                        </div>

                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 md:p-12 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-500 font-semibold text-base md:text-lg">
                            No accepted best seller courses found for "{formatCategoryLabel(activeCategory)}".
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default BestSellerCourses;