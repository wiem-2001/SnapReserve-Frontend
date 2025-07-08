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
import Events from '../pages/Events.jsx';
import ManageEvents from '../pages/ManageEvents.jsx';
import PurchasedTickets from '../pages/PurchasedTickets.jsx';
import Preferences from '../pages/Preferences.jsx';
import Notifications from '../pages/Notifications.jsx';
import AccountSettings from '../pages/AccountSettings.jsx';
import CreateEvent from '../pages/CreateEvent/CreateEvent.jsx';
import OrganizerAnalytics from '../pages/OrganizerAnalytics.jsx';
import PaymentInfo from '../pages/PaymentInfo.jsx';
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
        <Route path="/purchased-tickets" element={<PurchasedTickets/>} />
        <Route path="/preferences" element={<Preferences/>} />
        <Route path="/payment-info" element={<PaymentInfo/>} />
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/account-settings" element={<AccountSettings/>} />
        <Route path="/create-event" element={<CreateEvent/>} />
        <Route path="/analytics" element={<OrganizerAnalytics/>} />
        
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

