import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiBookOpen,
    FiCpu,
    FiAward,
    FiUsers,
    FiCheckCircle,
    FiArrowRight,
    FiZap,
    FiRefreshCw,
    FiTarget,
    FiEye,
    FiStar
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const AboutUs = () => {
    const axiosPublic = useAxiosPublic();

    const [statsData, setStatsData] = useState({
        activeLearners: 0,
        coursesCount: 0,
        expertMentors: 0,
        totalLessons: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [instructors, setInstructors] = useState([]);
    const [instructorsLoading, setInstructorsLoading] = useState(true);
    const [instructorsError, setInstructorsError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await axiosPublic.get('/stats');
                if (isMounted) {
                    setStatsData(res.data);
                }
            } catch (err) {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const fetchInstructors = async () => {
            try {
                setInstructorsLoading(true);
                setInstructorsError(false);
                const res = await axiosPublic.get('/instructors/featured');
                if (isMounted) {
                    setInstructors(res.data || []);
                }
            } catch (err) {
                if (isMounted) setInstructorsError(true);
            } finally {
                if (isMounted) setInstructorsLoading(false);
            }
        };

        fetchStats();
        fetchInstructors();

        return () => {
            isMounted = false;
        };
    }, [axiosPublic]);

    const formatNumber = (num) => {
        if (num === undefined || num === null || isNaN(num)) return '0';
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
        return `${num}+`;
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } }
    };

    const stats = [
        {
            id: 1,
            label: "Active Learners",
            value: formatNumber(statsData.activeLearners),
            icon: <FiUsers className="w-5 h-5 text-[#07A698]" />
        },
        {
            id: 2,
            label: "Expert Mentors",
            value: formatNumber(statsData.expertMentors),
            icon: <FiAward className="w-5 h-5 text-[#07A698]" />
        },
        {
            id: 3,
            label: "Specialized Courses",
            value: formatNumber(statsData.coursesCount),
            icon: <FiBookOpen className="w-5 h-5 text-[#07A698]" />
        },
        {
            id: 4,
            label: "Lessons Available",
            value: formatNumber(statsData.totalLessons),
            icon: <FiCpu className="w-5 h-5 text-[#07A698]" />
        },
    ];

    return (
        <div className="relative w-full text-slate-800 pt-36 pb-24 px-6 lg:px-16 overflow-hidden bg-slate-50/50">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#07A698]/10 via-[#07A698]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-[#07A698]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <motion.section
                className="max-w-4xl mx-auto text-center mb-24 relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <div className="inline-flex items-center gap-2 bg-[#07A698]/10 border border-[#07A698]/20 text-[#07A698] font-semibold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-sm">
                    <FiZap className="w-3.5 h-3.5" /> Empowering Next-Gen Innovators
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
                    Redefining Online Education with <span className="bg-gradient-to-r from-[#07A698] to-[#05756c] bg-clip-text text-transparent">EdCare</span>
                </h1>

                <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                    We bridge the gap between complex engineering concepts, practical development, and intuitive digital learning experiences.
                </p>
            </motion.section>

            <motion.section
                className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-28"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.div
                    variants={fadeInUp}
                    className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#07A698]/40 transition-all duration-300"
                >
                    <div className="w-14 h-14 rounded-2xl bg-[#07A698]/10 flex items-center justify-center text-[#07A698] mb-6">
                        <FiTarget className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Our Mission</h3>
                    <p className="text-slate-600 leading-relaxed text-base">
                        To make technical mastery accessible to every ambitious learner, regardless of background,
                        by pairing structured curricula with real-world projects, direct mentorship, and honest
                        feedback on progress.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#07A698]/40 transition-all duration-300"
                >
                    <div className="w-14 h-14 rounded-2xl bg-[#07A698]/10 flex items-center justify-center text-[#07A698] mb-6">
                        <FiEye className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Our Vision</h3>
                    <p className="text-slate-600 leading-relaxed text-base">
                        A world where a student anywhere can learn from the best instructors, earn credentials that
                        actually reflect demonstrated skill, and turn that learning into a career — without gatekeeping
                        or geography getting in the way.
                    </p>
                </motion.div>
            </motion.section>

            <motion.section
                className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-28"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-6 lg:pr-6">
                    <span className="text-[#07A698] font-bold text-sm uppercase tracking-wider">What We Stand For</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        Built for Students, Engineers, & Problem Solvers
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                        EdCare was designed to make technical mastery accessible. From full-stack web development to AI-driven automation, interactive systems, and machine learning models, we provide structured paths to turn knowledge into real-world projects.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {[
                            "Hands-on project experience",
                            "Real-time analytics & dashboards",
                            "Direct mentor interactions",
                            "Personalized skill pathways"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                                <div className="w-7 h-7 rounded-lg bg-[#07A698]/10 flex items-center justify-center shrink-0">
                                    <FiCheckCircle className="text-[#07A698] w-4 h-4" />
                                </div>
                                <span className="text-slate-700 font-medium text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="lg:col-span-5 relative">
                    <div className="relative bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-slate-800 overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#07A698]/25 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#07A698]/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="w-14 h-14 rounded-2xl bg-[#07A698]/20 border border-[#07A698]/40 flex items-center justify-center text-[#07A698] mb-8 shadow-inner">
                            <FiCpu className="w-7 h-7" />
                        </div>

                        <h3 className="text-2xl font-bold mb-3 tracking-tight">Driven by Real Data</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-8">
                            Every number on this page is pulled live from our platform — real courses, real instructors, and real learners, not placeholder statistics.
                        </p>

                        {!loading && !error && (
                            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#07A698] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#07A698]" />
                                    </div>
                                    <span className="text-xs font-mono text-slate-200">Live Stats Loaded</span>
                                </div>
                                <span className="text-xs font-mono text-[#07A698] bg-[#07A698]/10 px-2.5 py-1 rounded-md border border-[#07A698]/30">
                                    {statsData.coursesCount} Courses
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.section>

            <motion.section
                className="max-w-6xl mx-auto mb-28"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            variants={fadeInUp}
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#07A698]/50 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#07A698]/10 flex items-center justify-center mb-4 transition-colors">
                                {stat.icon}
                            </div>

                            <h4 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 tracking-tight min-h-[44px] flex items-center">
                                {loading ? (
                                    <span className="inline-block w-20 h-8 bg-slate-200 animate-pulse rounded-lg" />
                                ) : error ? (
                                    <span className="text-xs text-rose-500 font-normal flex items-center gap-1">
                                        <FiRefreshCw className="w-3 h-3 animate-spin" /> Error
                                    </span>
                                ) : (
                                    stat.value
                                )}
                            </h4>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="max-w-6xl mx-auto mb-28"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-[#07A698] font-bold text-sm uppercase tracking-wider">Meet Our Team</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mt-3">
                        Learn From Instructors Actually Teaching Right Now
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-base mt-4">
                        These are real mentors on EdCare today, ranked by the students and courses they're actively running.
                    </p>
                </motion.div>

                {instructorsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm animate-pulse space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                                <div className="h-3 w-1/2 bg-slate-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : instructorsError ? (
                    <p className="text-center text-sm text-rose-500">Could not load instructor data right now.</p>
                ) : instructors.length === 0 ? (
                    <p className="text-center text-sm text-slate-400">No instructors to show yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {instructors.map((instructor) => (
                            <motion.div
                                key={instructor.email}
                                variants={fadeInUp}
                                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#07A698]/40 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={instructor.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                                        alt={instructor.name}
                                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{instructor.name}</h4>
                                        {instructor.title && (
                                            <p className="text-xs text-[#07A698] font-semibold truncate">{instructor.title}</p>
                                        )}
                                    </div>
                                </div>

                                {instructor.bio && (
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                                        {instructor.bio}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <FiBookOpen className="text-[#07A698]" /> {instructor.totalCourses} {instructor.totalCourses === 1 ? 'course' : 'courses'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <FiUsers className="text-[#07A698]" /> {instructor.totalStudents} students
                                    </span>
                                    {instructor.avgRating > 0 && (
                                        <span className="flex items-center gap-1.5">
                                            <FiStar className="text-amber-400" /> {instructor.avgRating}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>

            <motion.section
                className="max-w-5xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <div className="relative bg-gradient-to-r from-[#07A698] via-[#069387] to-[#04685f] rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl shadow-[#07A698]/15 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight relative z-10">
                        Ready to Elevate Your Tech Journey?
                    </h2>
                    <p className="text-white/90 text-base sm:text-lg mb-8 max-w-xl mx-auto relative z-10 font-normal">
                        Whether you want to master new engineering skills or mentor the next generation, EdCare provides the platform.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
                        <Link
                            to="/allCourses"
                            className="inline-flex items-center gap-2 bg-white text-[#05756c] hover:text-[#045952] font-bold px-7 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 text-sm group"
                        >
                            Explore Courses
                            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        <Link
                            to="/teachON"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all border border-white/20 text-sm backdrop-blur-md hover:-translate-y-0.5"
                        >
                            Become an Instructor
                        </Link>
                    </div>
                </div>
            </motion.section>

        </div>
    );
};

export default AboutUs;