import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Banner from '../Banner/Banner';
import PopularCourse from '../PopularCourse/PopularCourse';
import BestSellerCourses from '../BestSellerCourses/BestSellerCourses';
import RecentCourses from '../RecentCourses/RecentCourses';
import PartnersSection from '../PartnersSection/PartnersSection';
import BecomeTeacherSection from '../BecomeTeacherSection/BecomeTeacherSection';
import WebsiteAnalyticsSection from '../WebsiteAnalyticsSection/WebsiteAnalyticsSection';
import StudentFeedbackSection from '../StudentFeedbackSection/StudentFeedbackSection';
import FAQSection from '../FAQSection/FAQSection';
import ContactAndLocation from '../ContactAndLocation/ContactAndLocation';

const Home = () => {

    return (
        
        <div>
            <Banner></Banner>
            <PopularCourse></PopularCourse>
            <WebsiteAnalyticsSection></WebsiteAnalyticsSection>
            <BestSellerCourses></BestSellerCourses>
            <PartnersSection></PartnersSection>
            <RecentCourses></RecentCourses>
            <StudentFeedbackSection></StudentFeedbackSection>
            <BecomeTeacherSection></BecomeTeacherSection>
            <FAQSection></FAQSection>

            <ContactAndLocation></ContactAndLocation>
        </div>
    );
};

export default Home;