import React from 'react';
import Marquee from 'react-fast-marquee';
import useFeaturedReviews from '../../../hooks/useFeaturedReviews';

const StudentFeedbackSection = () => {
  const [featuredReviews = [], loading] = useFeaturedReviews();

  if (loading) {
    return (
      <section className="w-full bg-[#f8fafc] py-16 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#07A698] border-t-transparent rounded-full" />
      </section>
    );
  }

  if (featuredReviews.length === 0) return null;

  return (
    <section className="w-full bg-[#f8fafc] py-12 md:py-16 px-4 select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] md:left-1/4 w-64 md:w-[500px] h-64 md:h-[500px] bg-indigo-500/[0.03] rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] md:right-1/4 w-48 md:w-[400px] h-48 md:h-[400px] bg-orange-500/[0.02] rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-center mb-4 md:mb-5">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-slate-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] text-[10px] md:text-xs font-semibold text-slate-600 tracking-wide uppercase">
            <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Student Feedback
          </div>
        </div>

        <h2 className="text-center text-[#0f172a] text-2xl md:text-[44px] font-extrabold tracking-tight max-w-4xl mx-auto leading-snug md:leading-[1.2] mb-10 md:mb-20">
          What Our Graduates & Students Are Saying
        </h2>

        <div className="relative">
          <Marquee
            direction="left"
            speed={35}
            gradient={true}
            gradientColor="#f8fafc"
            gradientWidth={80}
            pauseOnHover={true}
          >
            <div className="flex items-stretch gap-4 md:gap-8 pr-4 md:pr-8">
              {featuredReviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-200/50 hover:border-orange-400 p-5 md:p-8 w-[85vw] md:w-[530px] flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_-10px_rgba(251,146,60,0.12)] transition-all duration-300 cursor-pointer"
                >
                  <div className="md:col-span-4 flex flex-col items-center text-center">
                    <img
                      src={review.userImage || 'https://i.ibb.co/mJRk027/default-avatar.png'}
                      alt={review.userName}
                      className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-4 border-slate-100 mb-2 md:mb-3.5 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="text-[#0D0D0D] font-bold text-lg md:text-xl tracking-tight">
                      {review.userName || 'Student'}
                    </h3>
                    <p className="text-[#64748b] text-[10px] md:text-xs font-medium mt-0.5 md:mt-1 leading-normal max-w-[130px]">
                      {review.courseName}
                    </p>
                  </div>

                  <div className="md:col-span-8 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 h-full flex flex-col justify-between relative md:py-2">
                    <div>
                      <span className="text-slate-200 font-serif text-4xl md:text-5xl font-bold leading-none select-none block mb-1">
                        “
                      </span>
                      <p className="text-[#334155] text-xs md:text-sm leading-relaxed font-medium md:pr-2">
                        {review.comment}
                      </p>
                    </div>

                    <div className="flex justify-end items-baseline gap-1 font-bold mt-4">
                      <span className="text-orange-500 text-xl md:text-2xl leading-none">{review.rating}</span>
                      <span className="text-slate-400 text-[10px] md:text-xs font-semibold">/5</span>
                      <span className="text-orange-500 text-base md:text-lg ml-0.5 group-hover:animate-pulse">★</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default StudentFeedbackSection;