/**
 * @file AppRoutes.jsx
 * @description Central routing configuration using React Router DOM.
 * @responsibility Binds path routes to their respective page components (Dashboard, Login, CreateTicket, TicketDetails, NotFound), and wraps protected pages inside Authentication Guards.
 */

// Placeholder for imports
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import Dashboard from '../pages/Dashboard/Dashboard';
// import Login from '../pages/Login/Login';
// import CreateTicket from '../pages/CreateTicket/CreateTicket';
// import TicketDetails from '../pages/TicketDetails/TicketDetails';
// import NotFound from '../pages/NotFound/NotFound';

/**
 * Route protection element wrapper.
 */
// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   return user ? children : <Navigate to="/login" />;
// };

const AppRoutes = () => {
  // TODO: Build Routes mapping
  // - /login (public)
  // - / (protected -> Dashboard)
  // - /tickets/create (protected -> CreateTicket)
  // - /tickets/:id (protected -> TicketDetails)
  // - * (NotFound)
  return null;
};

export default AppRoutes;
