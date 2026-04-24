import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { muiTheme } from './styles/muiTheme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import api from './api/client';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (!token) { setStatus('fail'); return; }

    // Validate token is still alive against the server
    api.get('/admin/projects')
      .then(() => setStatus('ok'))
      .catch(() => setStatus('fail'));
  }, []);

  if (status === 'checking') return null; // brief blank while verifying
  if (status === 'fail') return <Navigate to="/login" replace />;
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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
