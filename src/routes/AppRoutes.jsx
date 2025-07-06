import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Deals from '../pages/Deals';
import ForgetPassword from '../pages/ForgetPassword';
import Profile from '../pages/Profile';
import Resell from '../pages/Resell';
import LoginPage from '../pages/LoginPage/LoginPage';
import VerifyEmail from '../pages/VerifyEmail';
import NotFound from '../pages/NotFound';
import SignupPage from '../pages/SignUp/SignupPage';
import Default from '../pages/Default';
import ResetPassword from '../pages/ResetPassword';
import Verified from '../pages/Verified';
import CheckRestPasswordEmail from '../pages/CheckRestPasswordEmail';
import Layout from '../AppLayout/Layout';
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

        <Route path="/" element={<Default />} />
        <Route path="/deals" element={<Layout ><Deals /></Layout>} />
        <Route path="/resell" element={<Layout><Resell /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
      
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

