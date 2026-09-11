import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import AllClasses from "../Pages/AllClasses/AllClasses";
import TeachOn from "../Pages/TeachOn/TeachOn";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ClassDetails from "../Pages/AllClasses/AllClassesDetails/ClassDetails";
import PrivateRoute from "./PrivateRoute";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Dashboard from "../Layout/Dashboard";

import Cart from "../Pages/Dashboard/Cart/Cart";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import AdminRoute from "../Pages/Dashboard/Admin/AdminRoute";
import AllClassesAdmin from "../Pages/Dashboard/Admin/AllClassesAdmin";
import TeacherRequests from "../Pages/Dashboard/Admin/TeacherRequests";
import AdminFinancials from "../Pages/Dashboard/Admin/AdminFinancials";
import ManageRefunds from "../Pages/Dashboard/Admin/ManageRefunds";

import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import AddNewClass from "../Pages/Dashboard/Teacher/AddNewClass";
import TeacherRoute from "../Pages/Dashboard/Teacher/TeacherRoute";
import MyAddedClasses from "../Pages/Dashboard/Teacher/MyAddedClasses";
import TeacherClassDetails from "../Pages/Dashboard/Teacher/TeacherClassDetails";
import Payment from "../Pages/Dashboard/Payment/Payment";
import Invoice from "../Pages/Dashboard/Invoice/Invoice";
import PaymentHistory from "../Pages/Dashboard/Payment/PaymentHistory/PaymentHistory";
import TeacherEarnings from "../Pages/Dashboard/Teacher/TeacherEarnings/TeacherEarnings";
import ClassStatsAdmin from "../Pages/Dashboard/Admin/ClassStatsAdmin";
import MyEnrolledClasses from "../Pages/Dashboard/MyEnrolledClasses/MyEnrolledClasses";
import MyEnrollClassDetails from "../Pages/Dashboard/MyEnrolledClasses/MyEnrollClassDetails";
import ManageNewsletter from "../Pages/Dashboard/Admin/ManageNewsletter ";
import ViewEnrolledStudents from "../Pages/Dashboard/Teacher/ViewEnrolledStudents";
import GradeSubmissions from "../Pages/Dashboard/Teacher/GradeSubmissions";
import CertificatePage from "../Pages/Dashboard/Student/CertificatePage";
import Overview from "../Pages/Dashboard/Overview/Overview";
import ForgotPassword from "../Pages/Login/ForgotPassword/ForgotPassword";
import MyCertificates from "../Pages/Dashboard/Student/MyCertificates/MyCertificates";
import ManagePayouts from "../Pages/Dashboard/Admin/ManagePayouts ";
import PlatformFeeSettings from "../Pages/Dashboard/Admin/PlatformFeeSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'allCourses', element: <AllClasses /> },
      { path: '/courseDetails/:id', element: <ClassDetails /> },
      { path: 'teachON', element: <PrivateRoute><TeachOn /></PrivateRoute> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      // Index Route — Overview Page
      {
        index: true,
        element: <Overview />
      },

      // Common & Student Routes
      {
        path: 'profile',
        element: <MyProfile />
      },
      {
        path: 'myenroll-class',
        element: <MyEnrolledClasses />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'payment',
        element: <Payment />
      },
      {
        path: 'invoice',
        element: <Invoice />
      },
      {
        path: 'payment-history',
        element: <PaymentHistory />
      },
      {
        path: 'myenroll-class/:id',
        element: <MyEnrollClassDetails />
      },
      {
        path: 'course-player/:id',
        element: <MyEnrollClassDetails />
      },
      {
        path: 'certificate/:classId',
        element: <PrivateRoute><CertificatePage /></PrivateRoute>
      },
      {
        path: 'my-certificates',
        element: <MyCertificates />
      },

      // Admin-only routes
      {
        path: 'manage-users',
        element: <AdminRoute><ManageUsers /></AdminRoute>
      },
      {
        path: 'all-classes',
        element: <AdminRoute><AllClassesAdmin /></AdminRoute>
      },
      {
        path: 'class/:id',
        element: <AdminRoute><ClassStatsAdmin /></AdminRoute>
      },
      {
        path: 'teacher-requests',
        element: <AdminRoute><TeacherRequests /></AdminRoute>
      },
      {
        path: 'manage-refunds',
        element: <AdminRoute><ManageRefunds /></AdminRoute>
      },
      {
        path: 'manage-payouts',
        element: <AdminRoute><ManagePayouts /></AdminRoute>
      },
      {
        path: 'admin-financials',
        element: <AdminRoute><AdminFinancials /></AdminRoute>
      },
      {
        path: 'manage-newsletter',
        element: <PrivateRoute><AdminRoute><ManageNewsletter /></AdminRoute></PrivateRoute>
      },
      {
        path: 'platform-fee',
        element: <AdminRoute><PlatformFeeSettings /></AdminRoute>
      },

      // Teacher-only routes
      {
        path: 'add-class',
        element: <TeacherRoute><AddNewClass /></TeacherRoute>
      },
      {
        path: 'my-classes',
        element: <TeacherRoute><MyAddedClasses /></TeacherRoute>
      },
      {
        path: 'my-class/:id',
        element: <TeacherRoute><TeacherClassDetails /></TeacherRoute>
      },
      {
        path: 'my-class/:id/students',
        element: <TeacherRoute><ViewEnrolledStudents /></TeacherRoute>
      },
      {
        path: 'my-earnings',
        element: <TeacherRoute><TeacherEarnings /></TeacherRoute>
      },
      {
        path: 'grade-submissions/:classId',
        element: <TeacherRoute><GradeSubmissions /></TeacherRoute>
      },
    ]
  }
]);