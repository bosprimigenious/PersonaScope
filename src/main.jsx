import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './theme.jsx';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);


