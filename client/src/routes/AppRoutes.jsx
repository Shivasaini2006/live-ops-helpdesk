/**
 * @file AppRoutes.jsx
 * @description Central routing configuration using React Router DOM.
 * @responsibility Binds path routes to their respective page components (Dashboard, Login, CreateTicket, TicketDetails, NotFound), and wraps protected pages inside Authentication Guards.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';
import CreateTicket from '../pages/CreateTicket/CreateTicket';
import TicketDetails from '../pages/TicketDetails/TicketDetails';
import NotFound from '../pages/NotFound/NotFound';
import Loader from '../components/common/Loader/Loader';

/**
 * Route protection element wrapper.
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader size="large" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/tickets/create"
        element={
          <PrivateRoute>
            <CreateTicket />
          </PrivateRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
