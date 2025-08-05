import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Deals from '../pages/Deals';
import ForgetPassword from '../pages/ForgetPassword';
import Profile from '../pages/Profile/Profile';
import Resell from '../pages/Resell';
import LoginPage from '../pages/LoginPage/LoginPage';
import VerifyEmail from '../pages/VerifyEmail';
import NotFound from '../pages/NotFound';
import SignupPage from '../pages/SignUp/SignupPage';
import ResetPassword from '../pages/ResetPassword';
import Verified from '../pages/Verified';
import CheckRestPasswordEmail from '../pages/CheckRestPasswordEmail';
import Layout from '../AppLayout/Layout';
import Events from '../pages/Events';
import PurchasedTickets from '../pages/purchased-tickets/PurchasedTickets.jsx';
import Preferences from '../pages/Preferences.jsx';

import AccountSettings from '../pages/AccountSettings/AccountSettings.jsx';
import CreateEvent from '../pages/CreateEvent/CreateEvent.jsx';
import OrganizerAnalytics from '../pages/OrganizerAnalytics.jsx';
import PaymentInfo from '../pages/PaymentInfo.jsx';
import EventDetails from '../pages/EventDetails/EventDetails.jsx';
import EditEvent from '../pages/EditEvent.jsx';
import OrganizerEventDetails from '../pages/OrganizerEventDetails.jsx';
import PaymentSuccessPage from '../pages/PaymentSuccess/PaymentSuccessPage.jsx';
import ManageEvents from '../pages/ManageEvents/ManageEvents.jsx';
import Notifications from '../pages/Notifications/Notifications.jsx';
import OrganizerDashboard from '../pages/OrganizerDashboard/OrganizerDashboard.js';
const AppRoutes = () => {
  return (
    <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/check-email" element={<CheckRestPasswordEmail />} />

        <Route path="/" element={<Events />} />
        <Route path="/deals" element={<Layout ><Deals /></Layout>} />
        <Route path="/resell" element={<Layout><Resell /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/manage-events" element={<ManageEvents/>} />
        <Route path="/purchased-tickets" element={<Layout><PurchasedTickets/></Layout>} />
        <Route path="/preferences" element={<Preferences/>} />
        <Route path="/payment-info" element={<PaymentInfo/>} />
        <Route path="/notifications" element={<Layout><Notifications/></Layout>} />
        <Route path="/account-settings" element={<AccountSettings/>} />
        <Route path="/create-event" element={<CreateEvent/>} />
        <Route path="/edit-event/:id" element={<EditEvent/>} />
        <Route path="/analytics" element={<OrganizerAnalytics/>} />
        <Route path="/event-details/:id" element={<Layout><EventDetails /></Layout>} />
        <Route path="/organizer-event-details/:id" element={<Layout><OrganizerEventDetails /></Layout>} />
        <Route path="/purchase/success" element = {<PaymentSuccessPage />} />

        <Route path="/organizerDashboard" element={<Layout ><OrganizerDashboard /></Layout>} />

        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

