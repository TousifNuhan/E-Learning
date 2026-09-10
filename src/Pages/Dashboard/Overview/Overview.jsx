import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    FiBookOpen, FiAward, FiTrendingUp, FiUsers,
    FiCheckSquare, FiUserCheck, FiClipboard,
    FiCreditCard, FiArrowRight
} from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const StudentOverview = ({ user }) => {
    const axiosSecure = useAxiosSecure();

    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['my-enrolled-classes'],
        queryFn: async () => {
            const res = await axiosSecure.get('/enrolled-classes');
            return res.data;
        },
    });

    const { data: applicationStatus, isLoading: isAppStatusLoading } = useQuery({
        queryKey: ['teacher-application-status', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/teacher-applications/status/${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <OverviewSkeleton />;

    const activeCourses = courses.filter(c => c.paymentStatus !== 'refunded');
    const inProgress = activeCourses.filter(c => (c.progressPercent || 0) > 0 && (c.progressPercent || 0) < 100);
    const completed = activeCourses.filter(c => (c.progressPercent || 0) === 100);
    const avgProgress = activeCourses.length
        ? Math.round(activeCourses.reduce((sum, c) => sum + (c.progressPercent || 0), 0) / activeCourses.length)
        : 0;

    return (
        <div className="space-y-6">
            <WelcomeBanner name={user?.displayName} subtitle="Here's a snapshot of your learning progress." />

            {!isAppStatusLoading && applicationStatus?.status && applicationStatus.status !== 'none' && (
                <TeacherApplicationStatusCard status={applicationStatus.status} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiBookOpen />} label="Enrolled Courses" value={activeCourses.length} color="teal" />
                <StatCard icon={<FiTrendingUp />} label="In Progress" value={inProgress.length} color="amber" />
                <StatCard icon={<FiCheckSquare />} label="Completed" value={completed.length} color="emerald" />
                <StatCard icon={<FiAward />} label="Avg. Progress" value={`${avgProgress}%`} color="indigo" />
            </div>

            <QuickLinksCard
                title="Continue Learning"
                links={[
                    { to: '/dashboard/myenroll-class', label: 'View Enrolled Courses', icon: <FiBookOpen /> },
                    { to: '/dashboard/payment-history', label: 'Payment History & Refunds', icon: <FiCreditCard /> },
                ]}
            />
        </div>
    );
};

const APPLICATION_STATUS_CONFIG = {
    pending: {
        icon: <FiClipboard />,
        label: 'Application Under Review',
        message: "Your instructor application has been submitted and is awaiting admin review. We'll notify you once a decision is made.",
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        iconBg: 'bg-amber-100',
    },
    approved: {
        icon: <FiCheckSquare />,
        label: 'Application Approved',
        message: 'Congratulations! Your instructor application has been approved. Refresh or log back in to access your Teacher dashboard.',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        iconBg: 'bg-emerald-100',
    },
    rejected: {
        icon: <FiUserCheck />,
        label: 'Application Not Approved',
        message: 'Your instructor application was not approved at this time. You are welcome to submit a new application in the future.',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        iconBg: 'bg-rose-100',
    },
};

const TeacherApplicationStatusCard = ({ status }) => {
    const config = APPLICATION_STATUS_CONFIG[status];
    if (!config) return null;

    return (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${config.bg} ${config.border}`}>
            <div className={`p-2.5 rounded-full ${config.iconBg} ${config.text} shrink-0`}>
                {config.icon}
            </div>
            <div>
                <p className={`text-sm font-bold ${config.text}`}>{config.label}</p>
                <p className="text-xs text-stone-600 mt-0.5">{config.message}</p>
            </div>
        </div>
    );
};

const TeacherOverview = ({ user }) => {
    const axiosSecure = useAxiosSecure();

    const { data: myClasses = [], isLoading: classesLoading } = useQuery({
        queryKey: ['my-classes-overview', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-classes/${user.email}`);
            return res.data;
        },
    });

    const { data: earnings = {}, isLoading: earningsLoading } = useQuery({
        queryKey: ['teacher-earnings-overview', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/teacher/earnings/${user.email}`);
            return res.data;
        },
    });

    if (classesLoading || earningsLoading) return <OverviewSkeleton />;

    const acceptedClasses = myClasses.filter(c => c.status === 'accepted');
    const pendingClasses = myClasses.filter(c => c.status === 'pending');
    const totalStudents = acceptedClasses.reduce((sum, c) => sum + (c.totalEnrollment || 0), 0);

    return (
        <div className="space-y-6">
            <WelcomeBanner name={user?.displayName} subtitle="Here's how your courses are performing." />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiBookOpen />} label="Active Courses" value={acceptedClasses.length} color="teal" />
                <StatCard icon={<FiClipboard />} label="Pending Review" value={pendingClasses.length} color="amber" />
                <StatCard icon={<FiUsers />} label="Total Students" value={totalStudents} color="indigo" />
                <StatCard icon={<FaBangladeshiTakaSign className="text-lg" />} label="Available Balance" value={`৳${(earnings.availableNetBalance || 0).toFixed(2)}`} color="emerald" />
            </div>

            <QuickLinksCard
                title="Instructor Tools"
                links={[
                    { to: '/dashboard/add-class', label: 'Add a New Class', icon: <FiBookOpen /> },
                    { to: '/dashboard/my-classes', label: 'Manage My Classes', icon: <FiClipboard /> },
                    { to: '/dashboard/my-earnings', label: 'View Earnings & Payouts', icon: <FaBangladeshiTakaSign /> },
                ]}
            />
        </div>
    );
};

const STATUS_COLORS = {
    accepted: '#10b981',
    pending: '#f59e0b',
    rejected: '#f43f5e',
};

const ChartCard = ({ title, isLoading, isEmpty, children }) => (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
        <h3 className="font-bold text-stone-800 text-sm mb-4">{title}</h3>
        {isLoading ? (
            <div className="h-64 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#07A698] border-t-transparent rounded-full animate-spin" />
            </div>
        ) : isEmpty ? (
            <div className="h-64 flex items-center justify-center text-xs text-stone-400">
                No data yet
            </div>
        ) : children}
    </div>
);

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-overview-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/stats');
            return res.data;
        },
    });

    const { data: financials = {}, isLoading: financialsLoading } = useQuery({
        queryKey: ['admin-overview-financials'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/financials');
            return res.data;
        },
    });

    const { data: revenueTrend = [], isLoading: revenueLoading } = useQuery({
        queryKey: ['admin-revenue-trend'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/analytics/revenue?days=30');
            return res.data;
        },
    });

    const { data: categoryData = [], isLoading: categoryLoading } = useQuery({
        queryKey: ['admin-category-enrollments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/analytics/enrollments-by-category');
            return res.data;
        },
    });

    const { data: statusData = [], isLoading: statusLoading } = useQuery({
        queryKey: ['admin-course-status'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/analytics/course-status');
            return res.data;
        },
    });

    if (statsLoading || financialsLoading) return <OverviewSkeleton />;

    return (
        <div className="space-y-6">
            <WelcomeBanner name="Admin" subtitle="Platform-wide overview and quick actions." />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiBookOpen />} label="Active Courses" value={stats.coursesCount || 0} color="teal" />
                <StatCard icon={<FiUsers />} label="Active Learners" value={stats.activeLearners || 0} color="indigo" />
                <StatCard icon={<FiUserCheck />} label="Expert Mentors" value={stats.expertMentors || 0} color="amber" />
                <StatCard icon={<FaBangladeshiTakaSign className="text-lg" />} label="Gross Sales" value={`৳${(financials.grossPlatformSales || 0).toFixed(2)}`} color="emerald" />
            </div>

            <ChartCard title="Revenue (last 30 days)" isLoading={revenueLoading} isEmpty={revenueTrend.length === 0}>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={revenueTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f4" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `৳${v}`} />
                        <Tooltip formatter={(v) => [`৳${v}`, 'Revenue']} />
                        <Line type="monotone" dataKey="revenue" stroke="#07A698" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Enrollments by category" isLoading={categoryLoading} isEmpty={categoryData.length === 0}>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f4" />
                            <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="enrollments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Course status breakdown" isLoading={statusLoading} isEmpty={statusData.length === 0}>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ status, count }) => `${status}: ${count}`}
                            >
                                {statusData.map((entry, idx) => (
                                    <Cell key={idx} fill={STATUS_COLORS[entry.status] || '#a8a29e'} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <QuickLinksCard
                title="Admin Tools"
                links={[
                    { to: '/dashboard/all-classes', label: 'Review Pending Classes', icon: <FiCheckSquare /> },
                    { to: '/dashboard/teacher-requests', label: 'Teacher Applications', icon: <FiUserCheck /> },
                    { to: '/dashboard/manage-refunds', label: 'Manage Refunds', icon: <FiCreditCard /> },
                    { to: '/dashboard/admin-financials', label: 'Financials & Payments', icon: <FaBangladeshiTakaSign /> },
                ]}
            />
        </div>
    );
};

const WelcomeBanner = ({ name, subtitle }) => (
    <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-black text-[#162726]">
            Welcome back{name ? `, ${name}` : ''}
        </h1>
        <p className="text-xs text-stone-500 pt-1 font-medium">{subtitle}</p>
    </div>
);

const colorMap = {
    teal: 'bg-[#07A698]/10 text-[#07A698]',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</span>
            <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
        </div>
        <p className="text-2xl font-black text-[#162726]">{value}</p>
    </div>
);

const QuickLinksCard = ({ title, links }) => (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-3">
        <h3 className="font-bold text-stone-800 text-sm">{title}</h3>
        <div className="space-y-2">
            {links.map((link) => (
                <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors group"
                >
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-stone-700">
                        <span className="text-[#07A698]">{link.icon}</span>
                        {link.label}
                    </span>
                    <FiArrowRight className="text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            ))}
        </div>
    </div>
);

const OverviewSkeleton = () => (
    <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
    </div>
);

const Overview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: dbUser = {}, isLoading } = useQuery({
        queryKey: ['user-role-overview', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <OverviewSkeleton />;

    const role = dbUser?.role || 'student';

    if (role === 'admin') return <AdminOverview />;
    if (role === 'teacher') return <TeacherOverview user={user} />;
    return <StudentOverview user={user} />;
};

export default Overview;