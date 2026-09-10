import React from 'react';
import { Link } from 'react-router-dom';

const BecomeTeacherSection = () => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-20 px-5 md:px-12 lg:px-16 font-sans relative overflow-hidden selection:bg-indigo-100">
      
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-56 h-56 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
        
        <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-start">
          <div className="absolute -top-4 -left-4 w-full h-full max-w-md bg-indigo-100 rounded-3xl -z-10 hidden md:block transform -rotate-3 transition-transform duration-500 hover:rotate-0" />

          <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-indigo-500/10 bg-slate-100 border border-slate-200/60 w-full h-64 md:h-[400px] lg:h-[550px]">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
              alt="Educator streaming an interactive online class workspace"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>

          <div className="absolute -bottom-6 -right-4 w-24 h-24 bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] bg-[size:12px_12px] -z-10 hidden md:block" />
        </div>

        <div className="lg:col-span-6 flex flex-col items-start w-full mt-2 md:mt-0">
          
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] md:text-xs font-bold tracking-wider uppercase px-4 py-1.5 md:py-2 rounded-full mb-5">
            Share Your Expertise
          </span>

          <h2 className="text-slate-800 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight md:leading-tight mb-5 md:mb-6">
            Become an instructor <br className="hidden md:inline" />
            and change lives globally.
          </h2>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 md:mb-10 w-full font-medium">
            Join a worldwide marketplace of lifelong learners. We provide the comprehensive tools, real-time streaming infrastructure, and localized payment gateways needed to turn your knowledge into a scalable global business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full mb-10 md:mb-12">
            <div className="flex items-start gap-3 bg-white p-3 md:p-0 md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-transparent">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-slate-700 md:text-slate-600 font-semibold md:font-medium">Keep up to 85% of seat revenue</p>
            </div>
            <div className="flex items-start gap-3 bg-white p-3 md:p-0 md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-transparent">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-slate-700 md:text-slate-600 font-semibold md:font-medium">Flexible dynamic schedules</p>
            </div>
            <div className="flex items-start gap-3 bg-white p-3 md:p-0 md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-transparent">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-slate-700 md:text-slate-600 font-semibold md:font-medium">Enterprise marketing outreach</p>
            </div>
            <div className="flex items-start gap-3 bg-white p-3 md:p-0 md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none border border-slate-100 md:border-transparent">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-slate-700 md:text-slate-600 font-semibold md:font-medium">24/7 dedicated course support</p>
            </div>
          </div>

          <Link to="/teachOn" className="w-full md:w-auto block group">
            <button className="flex w-full md:w-auto items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm md:text-base px-6 py-4 md:px-8 md:py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 transform group-hover:-translate-y-0.5 active:translate-y-0">
              <span>Start teaching today</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default BecomeTeacherSection;