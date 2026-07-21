/**
 * @file App.jsx
 * @description Main entry root component of the React application.
 * @responsibility Coordinates and nests all global State Providers and mounts the AppRoutes router within a consistent layout frame.
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { TicketProvider } from './context/TicketContext';
import useAuth from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar/Navbar';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Footer from './components/layout/Footer/Footer';
import './styles/global.css';

/**
 * Inner layout manager that handles conditional rendering of navigation layout structures.
 */
const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    // Render full-screen views (like Login page)
    return <AppRoutes />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <main className="content">
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <TicketProvider>
            <MainLayout />
          </TicketProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
