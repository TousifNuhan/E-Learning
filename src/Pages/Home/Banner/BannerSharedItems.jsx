
import React from 'react';

const BannerSharedItems = ({ header, paragraph, buttonName }) => {

    // const container = useRef()

    // useGSAP(() => {
    //     gsap.from(".box", {
    //         y: 500,
    //         duration: 1,
    //         delay: 0.5
    //     })
    // },{scope:container})

    return (
        <div
        // ref={container}
        >
            <div className="box relative flex flex-col items-center justify-center h-full bg-black/40 text-white text-center lg:px-16 md:py-8 lg:py-10 md:w-3/5 w-4/5 px-4 py-4 lg:w-4/5 mx-auto mt-3 md:mt-0">
                <h1 className="md:text-2xl text-lg lg:text-4xl font-bold mb-1 md:mb-4">{header}</h1>
                <p className="text-xs md:text-sm md:w-4/5">{paragraph}</p>
                <button className="group mt-3 md:mt-4 relative px-6 py-2.5 md:px-10 md:py-4 font-medium md:font-semibold text-xs md:text-base text-neutral-900 rounded-full bg-gradient-to-r from-[#29E7E7] to-[#71FA5C] overflow-hidden focus:outline-none cursor-pointer">

                    <span className="relative block overflow-hidden h-4 md:h-6">

                        {/* FIXED: Changed 'block' to 'flex items-center justify-center h-full' to force perfect vertical centering */}
                        <span className="flex items-center justify-center h-full transition-transform duration-500 ease-out transform group-hover:-translate-y-full">
                            {buttonName}
                        </span>

                        {/* FIXED: Applied the same flex centering to the hover text */}
                        <span className="absolute inset-0 flex items-center justify-center h-full transition-transform duration-500 ease-out transform translate-y-full group-hover:translate-y-0">
                            {buttonName}
                        </span>

                    </span>

                </button>
            </div>
        </div>
    );
};

export default BannerSharedItems;