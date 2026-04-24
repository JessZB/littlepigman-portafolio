import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/theme.css';
import './Login.css';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const processedRef = React.useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const token = searchParams.get('token');
    const artistId = searchParams.get('artistId');
    const error = searchParams.get('error');

    if (token && artistId) {
      processedRef.current = true;
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('artistId', artistId);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard');
    }

    if (error) {
      processedRef.current = true;
      const errorMsg = t(`login.errors.${error}`) !== `login.errors.${error}` 
        ? t(`login.errors.${error}`) 
        : t('login.errors.default');
        
      enqueueSnackbar(errorMsg, { variant: 'error' });
      setSearchParams({});
    }
  }, [searchParams, navigate, t, enqueueSnackbar, setSearchParams]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/login';
  };

  return (
    <div className="login-container">
      <div className="glass-card login-box">
        <h1 className="logo">Transer OS<span>Bridge</span></h1>
        <p>{t('login.subtitle')}</p>
        <button onClick={handleLogin} className="btn-primary login-btn">
          {t('login.sign_in')}
        </button>
      </div>
    </div>
  );
};

export default Login;
