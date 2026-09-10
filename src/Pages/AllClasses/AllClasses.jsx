import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdPeople, MdArrowForward, MdSearch, MdClose, MdFilterList } from "react-icons/md";
import { Link } from 'react-router-dom';
import useClasses from '../../hooks/useClasses';
import useAuth from '../../hooks/useAuth';
import useEnrolledClassIds from '../../hooks/useEnrolledClassIds ';

const AllClasses = () => {
    const [classes = []] = useClasses();
    const { user } = useAuth();
    const [enrolledIds = []] = useEnrolledClassIds();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const acceptedClasses = useMemo(() => {
        return classes.filter(course => course?.status === 'accepted');
    }, [classes]);

    const categories = useMemo(() => {
        const unique = new Set();
        acceptedClasses.forEach(c => {
            if (c?.category) {
                unique.add(c.category);
            }
        });
        return ['All', ...Array.from(unique)];
    }, [acceptedClasses]);

    const normalizeStr = (str = '') => str.toLowerCase().trim();

    const filteredClasses = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return acceptedClasses.filter(course => {
            const matchesSearch =
                !query ||
                (course?.title && course.title.toLowerCase().includes(query)) ||
                (course?.teacherName && course.teacherName.toLowerCase().includes(query)) ||
                (course?.name && course.name.toLowerCase().includes(query)) ||
                (course?.description && course.description.toLowerCase().includes(query));

            const matchesCategory =
                selectedCategory === 'All' ||
                normalizeStr(course?.category) === normalizeStr(selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [acceptedClasses, searchQuery, selectedCategory]);

    return (
        <div>
            <Helmet>
                <title>EdCare | All Courses</title>
            </Helmet>
            <section className="w-full bg-[#fafbfb] min-h-screen py-16 md:py-24 px-4 md:px-12 font-sans text-stone-800 antialiased selection:bg-[#07A698] selection:text-white">
                <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 border-b border-stone-200 pb-10 pt-12">
                        <div className="max-w-2xl">
                            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#07A698] font-semibold mb-3">
                                Learn • Grow • Succeed
                            </p>

                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight md:leading-[0.9] text-stone-900">
                                Discover
                                <br className="hidden sm:inline" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07A698] via-[#15c7b6] to-[#059669]">
                                    {' '}World-Class Courses
                                </span>
                            </h1>
                            <p className="mt-4 md:mt-6 text-xs md:text-base text-stone-500 leading-relaxed">
                                Learn from experienced instructors, master in-demand skills, and transform your future through carefully crafted learning experiences.
                            </p>
                        </div>

                        <div className="w-full lg:max-w-md relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <MdSearch className="h-5 w-5 text-stone-400 group-focus-within:text-[#07A698] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by course title, tech stack, or teacher..."
                                className="w-full h-12 pl-12 pr-10 text-sm bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-[#07A698] focus:ring-1 focus:ring-[#07A698] shadow-sm shadow-stone-100/80 transition-all placeholder-stone-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-3 flex items-center justify-center p-1 my-auto h-6 w-6 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                                    title="Clear search query"
                                >
                                    <MdClose className="text-sm" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 shrink-0">
                            <MdFilterList className="text-base text-[#07A698]" />
                            <span>Category:</span>
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-[#07A698] text-white shadow-md shadow-[#07A698]/20'
                                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {filteredClasses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {filteredClasses.map((course) => {
                                const courseId = (course.id || course._id)?.toString();
                                const isEnrolled = !!user && enrolledIds.includes(courseId);
                                const isInstructorInactive = course.instructorStatus === 'deactivated';
                                const priceVal = Number(course?.price || 0);

                                return (
                                    <div
                                        key={courseId}
                                        className="group flex flex-col bg-white border border-stone-200/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#07A698]/5 transition-all duration-500"
                                    >
                                        <div className="w-full aspect-[16/10] overflow-hidden relative bg-stone-100">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-stone-100 px-4 py-1.5 rounded-full shadow-sm">
                                                <span className="text-sm font-bold text-stone-900">
                                                    {priceVal === 0 ? "FREE" : `$${priceVal.toFixed(2)}`}
                                                </span>
                                            </div>

                                            {isEnrolled && (
                                                <div className="absolute top-4 left-4 bg-[#07A698] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                                    Enrolled
                                                </div>
                                            )}

                                            {isInstructorInactive && !isEnrolled && (
                                                <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                                    Enrollment Closed
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 md:p-7 flex flex-col justify-between flex-grow space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#07A698]" />
                                                        <p className="text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase truncate max-w-[150px]">
                                                            By {course.teacherName || course.name || 'Instructor'}
                                                        </p>
                                                    </div>
                                                    {course.category && (
                                                        <span className="text-[10px] font-bold text-[#07A698] bg-[#07A698]/10 px-2 py-0.5 rounded-md uppercase shrink-0">
                                                            {course.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base md:text-lg font-bold text-stone-900 group-hover:text-[#07A698] transition-colors line-clamp-2 leading-snug">
                                                    {course.title}
                                                </h3>

                                                <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                                                    {course.description}
                                                </p>
                                            </div>

                                            <div className="h-px bg-stone-100 w-full" />

                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center gap-1.5 text-stone-500">
                                                    <MdPeople className="h-4 w-4 text-stone-400" />
                                                    <span className="text-xs font-mono font-medium">
                                                        {(course.totalEnrollment || 0).toLocaleString()} enrolled
                                                    </span>
                                                </div>

                                                {isEnrolled ? (
                                                    <Link to={`/courseDetails/${courseId}`}>
                                                        <button 
                                                            className="inline-flex items-center justify-center gap-2 h-10 px-4 md:px-5 rounded-xl text-xs uppercase font-semibold tracking-wider bg-[#07A698] border border-[#07A698] text-white hover:bg-[#05857a] transition-all duration-300 cursor-pointer shadow-xs"
                                                        >
                                                            <span>View Course</span>
                                                            <MdArrowForward className="text-sm transform group-hover:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </Link>
                                                ) : isInstructorInactive ? (
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center justify-center gap-2 h-10 px-4 md:px-5 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                                                        title="This instructor's account is currently inactive"
                                                    >
                                                        Enrollment Closed
                                                    </button>
                                                ) : (
                                                    <Link to={`/courseDetails/${courseId}`}>
                                                        <button 
                                                            className="inline-flex items-center justify-center gap-2 h-10 px-4 md:px-5 rounded-xl text-xs uppercase font-semibold tracking-wider bg-[#fffaf8] hover:bg-[#07A698] border border-[#07A698]/20 hover:border-[#07A698] text-stone-900 hover:text-white transition-all duration-300 cursor-pointer shadow-xs"
                                                        >
                                                            <span>Enroll</span>
                                                            <MdArrowForward className="text-sm transform group-hover:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full py-16 md:py-20 text-center bg-white border border-stone-200/40 rounded-3xl max-w-xl mx-auto space-y-4 shadow-sm px-4">
                            <div className="h-12 w-12 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-400 text-xl">
                                <MdSearch />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-stone-900">No course items matched</h4>
                                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                                    We couldn't find matches for {searchQuery && <span>"<span className="font-semibold text-stone-600 break-all">{searchQuery}</span>"</span>} {selectedCategory !== 'All' && <span>in category <span className="font-semibold text-stone-600">{selectedCategory}</span></span>}.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                }}
                                className="text-xs font-bold text-[#07A698] hover:text-[#05857a] underline decoration-2 underline-offset-4 cursor-pointer transition-colors"
                            >
                                Reset Search & Filters
                            </button>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
};

export default AllClasses;