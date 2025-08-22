import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Deals from '../pages/Deals';
import ForgetPassword from '../pages/ForgetPassword';
import Profile from '../pages/Profile/Profile';
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
import AccountSettings from '../pages/AccountSettings/AccountSettings.jsx';
import CreateEvent from '../pages/CreateEvent/CreateEvent.jsx';
import OrganizerAnalytics from '../pages/OrganizerAnalytics.jsx';
import EventDetails from '../pages/EventDetails/EventDetails.jsx';
import EditEvent from '../pages/EditEvent.jsx';
import OrganizerEventDetails from '../pages/OrganizerEventDetails.jsx';
import PaymentSuccessPage from '../pages/PaymentSuccess/PaymentSuccessPage.jsx';
import ManageEvents from '../pages/ManageEvents/ManageEvents.jsx';
import Notifications from '../pages/Notifications/Notifications.jsx';
import Favorites from '../pages/Favorites/Favorites.jsx';
import PointsDashboard from '../pages/PointsDashboard/PointsDashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verified" element={<Verified />} />
      <Route path="/check-email" element={<CheckRestPasswordEmail />} />
      <Route path="/" element={<Events />} />
      <Route path="/unauthorized" element={<Unauthorized />} />


      {/* Common routes accessible to all authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['attendee', 'organizer']}>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['attendee', 'organizer']}>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute allowedRoles={['attendee', 'organizer']}>
            <AccountSettings />
          </ProtectedRoute>
        }
      />

      {/* Organizer-only routes */}
      <Route
        path="/manage-events"
        element={
           <ProtectedRoute allowedRoles={['organizer']}>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <EditEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <OrganizerAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer-event-details/:id"
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <Layout>
              <OrganizerEventDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Attendee-only routes */}
      <Route
        path="/deals"
        element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <Layout>
              <Deals />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchased-tickets"
        element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <Layout>
              <PurchasedTickets />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <Layout>
              <Favorites />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-details/:id"
        element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <Layout>
              <EventDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase/success"
        element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <PaymentSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/points-dashboard"
        element={
          <ProtectedRoute allowedRoles={['attendee']}>
            <Layout>
              <PointsDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;