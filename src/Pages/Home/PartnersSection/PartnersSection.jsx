import React from 'react';
import Marquee from 'react-fast-marquee';

const PartnersSection = () => {
  const partners = [
    {
      name: 'Volkswagen',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
      tag: 'IoT & Mobility',
      description: 'Collaborating on next-generation smart-mobility software frameworks and automotive IoT solutions.',
    },
    {
      name: 'Cisco',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
      tag: 'Cloud & Security',
      description: 'Securing cloud infrastructures and delivering ultra-low latency internal networking components.',
    },
    {
      name: 'AT&T',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/31/AT%26T_logo_2016.svg',
      tag: '5G Connectivity',
      description: 'Co-developing high-bandwidth enterprise 5G automation connectivity layers.',
    },
    {
      name: 'Procter & Gamble',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Procter_%26_Gamble_logo.svg',
      tag: 'Logistics AI',
      description: 'Optimizing international logistics pipelines with machine learning analytics systems.',
    },
    {
      name: 'HPE',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Hewlett_Packard_Enterprise_logo.svg',
      tag: 'Data Grids',
      description: 'Partnering on deep server architectural deployment clusters and private data grids.',
    },
  ];

  return (
    <section className="w-full bg-[#f8fafc] pt-20 md:pt-20 pb-10 md:pb-16 px-4 md:px-8 border-y border-slate-200/60 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block bg-white text-slate-600 border border-slate-200/80 text-[10px] md:text-[11px] font-semibold tracking-wider uppercase px-3 py-1 md:px-3.5 md:py-1 rounded-full shadow-sm mb-3">
            Global Enterprise Network
          </span>
          <h2 className="text-slate-800 text-base md:text-xl font-bold tracking-tight">
            Trusted by over <span className="text-emerald-600">15,000+</span> companies and millions of learners globally
          </h2>
        </div>

        <div className="relative py-4 mb-8 md:mb-16">
          <Marquee
            direction="left"
            speed={40}
            gradient={true}
            gradientColor="#f8fafc"
            pauseOnHover={true}
          >
            <div className="flex items-center gap-4 md:gap-6 pr-4 md:pr-6">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="group relative flex items-center justify-center bg-white px-6 py-3 md:px-8 md:py-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer min-w-[140px] md:min-w-[170px] h-[60px] md:h-[68px]"
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-6 md:max-h-7 max-w-[90px] md:max-w-[110px] object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />

                  <div className="absolute -bottom-2 translate-y-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-56 md:w-64 bg-[#0c1e33] text-white text-center p-3 md:p-4 rounded-xl shadow-xl pointer-events-none">
                    <div className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 md:mb-2">
                        {partner.tag}
                    </div>
                    <div className="text-[11px] md:text-xs text-slate-300 leading-relaxed">
                        {partner.description}
                    </div>
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c1e33] rotate-45"></div>
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

export default PartnersSection;