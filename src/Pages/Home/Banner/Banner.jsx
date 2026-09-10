import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import img1 from '../../../assets/img1.jpg';
import img2 from '../../../assets/img2.jpg';
import img3 from '../../../assets/img3.jpg';
import img4 from '../../../assets/img4.jpg';

import withAutoplay from 'react-awesome-slider/dist/autoplay';

import './styles.css'
import BannerSharedItems from './BannerSharedItems';
import { Link } from 'react-router-dom';

const Banner = () => {

  const AutoplaySlider = withAutoplay(AwesomeSlider);

  return (
    <div className="relative w-full overflow-hidden">
      <AutoplaySlider
        play={true}
        cancelOnInteraction={false}
        interval={5000}
      >
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
          <div className='absolute inset-0 bg-black/50'></div>
          <Link to='/allCourses'>
            <BannerSharedItems
              header="Elevate Your Skills, Empower Your Future"
              paragraph="Explore a diverse catalog of industry-driven courses curated by expert tutors. Gain practical knowledge, master new tools, and track your progress in real-time."
              buttonName="Explore All Courses"
            ></BannerSharedItems>
          </Link>
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
          <Link to='/teachOn'>
            <BannerSharedItems
              header="Inspire Minds, Start Teaching Today"
              paragraph="Turn your passion into a profession. Share your knowledge, manage your digital classroom seamlessly, and build an impactful online teaching presence with our robust tools."
              buttonName="Join Our Faculty"
            ></BannerSharedItems>
          </Link>
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
          <Link to='/login'>
            <BannerSharedItems
              header="Seamless Class & Learning Management"
              paragraph="An all-in-one digital ecosystem built to handle structured assignments, interactive grading pipelines, and transparent student evaluation metrics effortlessly."
              buttonName="Discover Features"
            ></BannerSharedItems>
          </Link>
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
          <Link to='/register'>
            <BannerSharedItems
              header="Building the Future of Digital Classrooms"
              paragraph="Join a fast-growing educational network where verified tutors, dedicated students, and high-quality course curricula unite to foster global academic excellence."
              buttonName="Get Started"
            ></BannerSharedItems>
          </Link>
        </div>
      </AutoplaySlider>
    </div>
  );
};

export default Banner;