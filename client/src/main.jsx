/**
 * @file main.jsx
 * @description Bootstrapping mounting file for Vite + React.
 * @responsibility Mounts the App root component to the DOM node index #root.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
