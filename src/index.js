import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { UserProvider } from './context/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
