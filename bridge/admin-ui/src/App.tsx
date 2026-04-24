import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { muiTheme } from './styles/muiTheme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import api from './api/client';
import ProfileEditor from './pages/ProfileEditor';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (!token) { 
      setStatus('fail'); 
      return; 
    }

    api.get('/admin/projects')
      .then(() => setStatus('ok'))
      .catch(() => {
        localStorage.removeItem('sessionToken');
        setStatus('fail');
      });
  }, []);

  if (status === 'checking') return null;
  if (status === 'fail') return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const [status, setStatus] = useState<'checking' | 'logged_in' | 'logged_out'>('checking');

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (!token) { 
      setStatus('logged_out'); 
      return; 
    }

    api.get('/admin/projects')
      .then(() => setStatus('logged_in'))
      .catch(() => {
        localStorage.removeItem('sessionToken');
        setStatus('logged_out');
      });
  }, []);

  if (status === 'checking') return null;
  if (status === 'logged_in') return <Navigate to="/dashboard" replace />;
  return children;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <SnackbarProvider 
        maxSnack={3} 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileEditor /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
