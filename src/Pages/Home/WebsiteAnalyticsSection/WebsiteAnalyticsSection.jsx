import React, { useMemo } from 'react';
import useClasses from '../../../hooks/useClasses';

const WebsiteAnalyticsSection = () => {
  // Destructure array returned by your useClasses hook
  const [classes = [], loading] = useClasses();

  // Compute analytics dynamically from the classes array
  const stats = useMemo(() => {
    // 1. Guard against non-array payloads or nested objects
    const classList = Array.isArray(classes)
      ? classes
      : Array.isArray(classes?.data)
      ? classes.data
      : [];

    // 2. Case-insensitive filter for accepted courses
    const acceptedCourses = classList.filter(
      (c) => c?.status?.toLowerCase() === 'accepted'
    );

    const totalCourses = acceptedCourses.length;

    // 3. Sum total enrollments (handles singular or plural property names)
    const totalEnrollments = acceptedCourses.reduce((sum, item) => {
      const enrollment = item?.totalEnrollment ?? item?.totalEnrollments ?? 0;
      return sum + (Number(enrollment) || 0);
    }, 0);

    // 4. Calculate average rating for valid numerical ratings
    const ratedCourses = acceptedCourses.filter(
      (c) => c?.rating !== undefined && c?.rating !== null && !isNaN(c.rating)
    );

    const averageRating =
      ratedCourses.length > 0
        ? (
            ratedCourses.reduce((sum, item) => sum + Number(item.rating), 0) /
            ratedCourses.length
          ).toFixed(1)
        : '0.0';

    return {
      totalCourses,
      totalEnrollments,
      averageRating,
    };
  }, [classes]);

  // Format numbers with thousands separators
  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  return (
    // FIXED: Responsive padding (py-12 on mobile, py-24 on desktop) and side padding
    <section className="w-full bg-[#0f172a] py-16 md:py-24 px-4 md:px-8 lg:px-16 font-sans relative overflow-hidden text-slate-100 select-none">
      
      {/* Decorative ambient blurred backgrounds */}
      {/* FIXED: Replaced invalid 1/12 classes with arbitrary percentages and scaled sizes for mobile */}
      <div 
        className="absolute top-1/4 left-[-10%] md:left-[8%] w-[250px] md:w-[450px] h-[250px] md:h-[450px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"
      />
      <div 
        className="absolute bottom-1/4 right-[-10%] md:right-[8%] w-[200px] md:w-[350px] h-[200px] md:h-[350px] bg-emerald-500/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"
      />

      {/* FIXED: Reduced gap on smaller screens */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Platform Metric Cards */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
          
          <div className="mb-8 md:mb-10 text-left">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] md:text-[11px] font-bold tracking-wider uppercase px-3 py-1 md:px-3.5 md:py-1 rounded-full mb-3 md:mb-4">
              Platform Scale Metrics
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Empowering global learning <br className="hidden md:block" />
              at an unprecedented scale.
            </h2>
          </div>

          {/* Metric Cards Stack */}
          <div className="space-y-4 md:space-y-5 max-w-lg">
            
            {/* Card 1: Total Active Courses */}
            <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 md:p-6 rounded-2xl flex items-center gap-4 md:gap-5 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 0 1 6-2.25c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.25v14.25" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Courses</p>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5 tracking-tight">
                  {loading ? (
                    <span className="inline-block w-12 md:w-16 h-5 md:h-6 bg-slate-800 animate-pulse rounded" />
                  ) : (
                    formatNumber(stats.totalCourses)
                  )}
                </h3>
              </div>
            </div>

            {/* Card 2: Total Platform Enrollments */}
            <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 md:p-6 rounded-2xl flex items-center gap-4 md:gap-5 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Platform Enrollments</p>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5 tracking-tight">
                  {loading ? (
                    <span className="inline-block w-12 md:w-16 h-5 md:h-6 bg-slate-800 animate-pulse rounded" />
                  ) : (
                    formatNumber(stats.totalEnrollments)
                  )}
                </h3>
              </div>
            </div>

            {/* Card 3: Average Platform Rating */}
            <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 md:p-6 rounded-2xl flex items-center gap-4 md:gap-5 hover:border-orange-500/40 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385c.116.488-.42.877-.84.61l-4.71-2.982a.563.563 0 0 0-.582 0l-4.71 2.982c-.42.267-.956-.122-.84-.61l1.285-5.385a.563.563 0 0 0-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Platform Rating</p>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5 tracking-tight flex items-baseline gap-1">
                  {loading ? (
                    <span className="inline-block w-12 md:w-16 h-5 md:h-6 bg-slate-800 animate-pulse rounded" />
                  ) : (
                    <>
                      {stats.averageRating}
                      <span className="text-[10px] md:text-xs font-normal text-slate-400">/ 5.0</span>
                    </>
                  )}
                </h3>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Static Image Frame Container */}
        {/* FIXED: Scaled down height for mobile (h-[350px]) to prevent taking up the whole screen */}
        <div className="lg:col-span-6 relative flex justify-center h-[350px] md:h-[450px] lg:h-[520px] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-slate-800 order-1 lg:order-2">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-10 pointer-events-none opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/40 z-10 pointer-events-none" />

          {/* FIXED: Removed inline styles and changed h-[130%] to h-full so it fits perfectly without scrolling */}
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80" 
            alt="Collaborative classroom platform interaction ecosystem" 
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
};

export default WebsiteAnalyticsSection;