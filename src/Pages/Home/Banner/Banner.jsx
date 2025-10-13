import React, { useRef } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import img1 from '../../../assets/img1.jpg';
import img2 from '../../../assets/img2.jpg';
import img3 from '../../../assets/img3.jpg';
import img4 from '../../../assets/img4.jpg';

import './styles.css'

const Banner = () => {

  const sliderRef = useRef(null);


  return (
    <div>
      <AwesomeSlider ref={sliderRef} animation="cubeAnimation" >
        {/* Slide 1 */}
        <div
          style={{
            backgroundImage: `url(${img1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            position: 'relative'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-20 flex flex-col items-center justify-center h-full  text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to EduManage</h1>
            <p className="text-xl">Empowering education through technology</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div
          style={{
            backgroundImage: `url(${img2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            position: 'relative'
          }}
        >
          <div className='absolute inset-0 bg-black/50'></div>
          <div className="relative flex flex-col items-center justify-center h-full bg-black/40 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Smart Learning Platform</h1>
            <p className="text-xl">Connecting students and tutors worldwide</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div
          style={{
            backgroundImage: `url(${img3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            position: 'relative'
          }}
        >
          <div className='absolute inset-0 bg-black/50'></div>
          <div className="relative flex flex-col items-center justify-center h-full bg-black/40 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Manage Courses Easily</h1>
            <p className="text-xl">Simplify class management and communication</p>
          </div>
        </div>

        {/* Slide 4 */}
        <div
          style={{
            backgroundImage: `url(${img4})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            position: 'relative'
          }}
        >
          <div className='absolute inset-0 bg-black/50'></div>
          <div className="relative flex flex-col items-center justify-center h-full bg-black/40 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Grow with EduManage</h1>
            <p className="text-xl">Empowering the future of digital learning</p>
          </div>
        </div>
      </AwesomeSlider>
    
    </div>
  );
};

export default Banner;
